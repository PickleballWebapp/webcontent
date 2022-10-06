import {Card, Col, Container, Row, Button} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {API} from "aws-amplify";
import {getGame} from "./graphql/queries";
import {useLocation} from "react-router-dom";
import {updateGame} from "./graphql/mutations";

export default function GameScore() {
    const location = useLocation();
    const { gameId } = location.state;

    const [game, setGame] = useState();

    useEffect(() => {
        fetchGame();
    }, []);

    async function fetchGame() {
        const apiData = await API.graphql({ query: getGame, variables: {id: gameId}});
        setGame(apiData.data.getGame);
    }

    async function giveServe(team1: boolean) {
        const updatedRecord = {
            id: game.id,
            team1serves: team1
        };
        const updatedGame = await API.graphql({ query: updateGame, variables: {input: updatedRecord}});
        await setGame(updatedGame.data.updateGame);
    }

    async function updateScore(team1: boolean, add: boolean) {
        const updatedRecord = {
            id: game.id,
            team1score: game.team1score + (team1 ? (add ? 1 : -1) : 0),
            team2score: game.team2score + (team1 ? 0 : (add ? 1 : -1))
        };
        const updatedGame = await API.graphql({ query: updateGame, variables: {input: updatedRecord}});
        await setGame(updatedGame.data.updateGame);
    }

    return (
        <Container fluid>
            <Row>
                <Col />
                <Col lg={8} xs={12}>
                    <h1 className="text-center p-3">
                        Game Score
                    </h1>
                    <div className="d-flex justify-content-center">
                        <Card style={{ width: '18rem' }} className={game && game.complete && "bg-success"} >
                            <Card.Body>
                                <Card.Text>
                                    <h1 className="text-center">
                                        {game ? `${game.team1score} - ${game.team2score}` : "loading..."}
                                    </h1>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                    <Row className="p-3">
                        <Col className={`card align-items-center p-4 m-2 ${cardColor(game, true)}`}>
                            <Row>
                                <h1 className="text-center">
                                    Team 1
                                </h1>
                            </Row>
                            <Row>
                                <div className="d-flex justify-content-center">
                                    <h5 className="text-center">
                                        {game ? `${game.player1} & ${game.player2}` : "loading..."}
                                    </h5>
                                </div>
                            </Row>
                            <Row>
                                <div className="d-flex justify-content-center">
                                    <Button variant="success" size="lg" className="m-1" onClick={() => updateScore(true, true)}>+1</Button>
                                    <Button variant="primary" className="m-1" onClick={() => giveServe(true)}>Give Serve</Button>
                                    <Button variant="danger" size="lg" className="m-1" onClick={() => updateScore(true, false)}>-1</Button>
                                </div>
                            </Row>
                        </Col>
                        <Col className={`card align-items-center p-4 m-2 ${cardColor(game, false)}`}>
                            <Row>
                                <h1 className="text-center">
                                    Team 2
                                </h1>
                            </Row>
                            <Row>
                                <div className="d-flex justify-content-center">
                                    <h5 className="text-center">
                                        {game ? `${game.player3} & ${game.player4}` : "loading..."}
                                    </h5>
                                </div>
                            </Row>
                            <Row>
                                <div className="d-flex justify-content-center">
                                    <Button variant="success" size="lg" className="m-1" onClick={() => updateScore(false, true)}>+1</Button>
                                    <Button variant="primary" className="m-1" onClick={() => giveServe(false)}>Give Serve</Button>
                                    <Button variant="danger" size="lg" className="m-1" onClick={() => updateScore(false, false)}>-1</Button>
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col />
            </Row>
        </Container>
    );
}

function cardColor(game, team1) {
    if(game && !game.complete && team1 === game.team1serves) {
        return "bg-info"
    }

    return "bg-light";
}