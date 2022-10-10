import {Col, Container, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {API} from "aws-amplify";
import {listGames} from "./graphql/queries";
import {gameTable} from "./Utils";

export default function Scores() {
    const [games, setGames] = useState([]);

    useEffect(() => {
        fetchGames();
    }, []);

    async function fetchGames() {
        const apiData = await API.graphql({query: listGames});
        setGames(apiData.data.listGames.items);
    }

    return (
        <Container fluid>
            <Row>
                <Col/>
                <Col xs={12} lg={8}>
                    <h1 className="text-center p-5">
                        Game Scores
                    </h1>
                    {gameTable(games)}
                </Col>
                <Col/>
            </Row>
        </Container>
    );
}