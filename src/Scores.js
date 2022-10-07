import {Col, Container, Row, Table} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {API, Auth} from "aws-amplify";
import {listGames} from "./graphql/queries";
import {Link} from "react-router-dom";

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
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Team 1</th>
                            <th>Team 2</th>
                            <th>Score</th>
                        </tr>
                        </thead>
                        <tbody>
                        {games.map((game) => (
                            <tr key={game.id}>
                                <td>{<Link to="/score"
                                           state={{gameId: game.id}}>{game.complete ? "Complete" : "Active"}</Link>}</td>
                                <td>{game.date}</td>
                                <td>{game.player1} & {game.player2}</td>
                                <td>{game.player3} & {game.player4}</td>
                                <td>{game.team1score} - {game.team2score}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Col>
                <Col/>
            </Row>
        </Container>
    );
}