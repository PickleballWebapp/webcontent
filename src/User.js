import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import {Col, Row} from "react-bootstrap";
import {API, Auth} from "aws-amplify";
import {getGame, getUser} from "./graphql/queries";
import {gameTable} from "./Utils";

export default function User() {
    const location = useLocation();
    let {user} = location.state || {user: null};
    const [userData, setUserData] = useState();
    const [games, setGames] = useState([]);

    useEffect(() => {
        fetchUserData();
    }, []);

    async function fetchUserData() {
        if(!user) {
            let userData = await Auth.currentAuthenticatedUser();
            user = userData.username;
        }
        const userData = await API.graphql({query: getUser, variables: {id: user}});
        setUserData(userData.data.getUser);

        let gameDataList = [];
        for (const game of userData.data.getUser.games) {
            const gameData = await API.graphql({query: getGame, variables: {id: game}});
            gameDataList.push(gameData.data.getGame);
        }
        setGames(gameDataList);
    }

    return (
        <Row>
            <Col sm={2}/>
            <Col sm={8}>
                <h1>{userData?.name}'s User Profile</h1>
                <Row>
                    <Col sm={2}>
                        <h6>Email:</h6>
                    </Col>
                    <Col>
                        <p>{userData?.email}</p>
                    </Col>
                </Row>
                <Row>
                    <Col sm={2}>
                        <h6>Wins:</h6>
                    </Col>
                    <Col>
                        <p>{userData?.wins}</p>
                    </Col>
                </Row>
                <Row>
                    <Col sm={2}>
                        <h6>Losses:</h6>
                    </Col>
                    <Col>
                        <p>{userData?.losses}</p>
                    </Col>
                </Row>
                <br/>
                <h4>{userData?.name}'s games</h4>
                {gameTable(games)}
            </Col>
            <Col sm={2}/>
        </Row>
    );
}