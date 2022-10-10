import {Col, Container, Row, Table} from "react-bootstrap";

import React, {useState, useEffect} from "react";
import {API} from "aws-amplify";
import {listUsers} from "./graphql/queries";
import {Link} from "react-router-dom";

export default function Rankings() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
        //eslint-disable-next-line
    }, []);

    /**
     * Fetch all users registered in system.
     */
    async function fetchUsers() {
        const apiData = await API.graphql({ query: listUsers });
        setUsers(apiData.data?.listUsers.items);
    }

    /**
     * Determines win rate given wins and losses.
     */
    function winRate(wins, losses) {
        if(wins === losses === 0) return 0;
        if(losses === 0) return 0;
        return (wins/(wins+losses)*100).toFixed(1);
    }

    /**
     * Determines which of two users has a higher win rate.
     */
    function comparator(usera, userb) {
        return winRate(userb.wins, userb.losses) - winRate(usera.wins, usera.losses);
    }

    return (
        <Container fluid>
            <Row>
                <Col />
                <Col xs={12} lg={8}>
                    <h1 className="text-center p-5">
                        Rankings
                    </h1>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Name</th>
                            <th>Record (W-L)</th>
                            <th>Win Rate (%)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {[...users].sort(comparator).map((user, index) => (
                            <tr key={user.id}>
                                <td>{index+1}</td>
                                <td><Link to="/user" state={{user: user.id}}>{user.name}</Link></td>
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