import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import {Col, Row, Table} from "react-bootstrap";
import {API, Auth} from "aws-amplify";
import {getUser} from "./graphql/queries";

export default function User() {
    const location = useLocation();
    let {user} = location.state || {user: null};
    const [userData, setUserData] = useState();

    useEffect(() => {
        fetchUserData();
    });

    async function fetchUserData() {
        if(!user) {
            let userData = await Auth.currentAuthenticatedUser();
            user = userData.username;
        }
        const apiData = await API.graphql({query: getUser, variables: {id: user}});
        setUserData(apiData.data.getUser);
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
                <h4>Past games</h4>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Username</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>1</td>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                    </tr>
                    <tr>
                        <td colSpan={4}>You have no recorded games!</td>
                    </tr>
                    </tbody>
                </Table>
            </Col>
            <Col sm={2}/>
        </Row>
    );
}