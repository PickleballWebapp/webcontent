import {Col, Container, Row, Table} from "react-bootstrap";

import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { listUsers } from "./graphql/queries";

export default function Rankings() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        const apiData = await API.graphql({ query: listUsers });
        const usersFromAPI = apiData.data.listUsers.items;
        setUsers(usersFromAPI);
    }

    return (
        <Container fluid>
            <Row>
                <Col />
                <Col xs={8}>
                    <h1 className="text-center p-5">
                        Rankings
                    </h1>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Rank</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Record (W-L)</th>
                            <th>Win Rate (%)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {[...users].sort(comparator).map((user, index) => (
                            <tr key={user.id}>
                                <td>{index+1}</td>
                                <td>{user.first}</td>
                                <td>{user.last}</td>
                                <td>{user.wins}-{user.losses}</td>
                                <td>{winRate(user.wins,user.losses)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Col>
                <Col />
            </Row>
        </Container>
    );
}

function winRate(wins, losses) {
    if(wins === losses === 0) return 0;
    if(losses === 0) return 0;
    return (wins/(wins+losses)*100).toFixed(2);
}

function comparator(usera, userb) {
    return winRate(userb.wins, userb.losses) - winRate(usera.wins, usera.losses);
}