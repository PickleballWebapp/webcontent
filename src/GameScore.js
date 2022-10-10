import {Card, Col, Container, Row, Button} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {API} from "aws-amplify";
import {getGame} from "./graphql/queries";
import {useLocation} from "react-router-dom";
import {updateGame} from "./graphql/mutations";

export default function GameScore() {

    //todo - game completion
    //todo - manually enter score
    //todo - add link to each user
    //todo - conditionally render game modification stuff - only show score for player types

    const location = useLocation();
    const { gameId } = location.state;

    const [game, setGame] = useState();

    useEffect(() => {
        fetchGame();
        //eslint-disable-next-line
    }, []);

    /**
     * Fetch information about game ID passed via state.
     */
    async function fetchGame() {
        const apiData = await API.graphql({ query: getGame, variables: {id: gameId}});
        setGame(apiData.data.getGame);
    }

    /**
     * Handle request to give serve to other team.
     */
    async function giveServe(team1: boolean) {
        const updatedRecord = {
            id: game?.id,
            team1serves: team1
        };
        const updatedGame = await API.graphql({ query: updateGame, variables: {input: updatedRecord}});
        await setGame(updatedGame.data.updateGame);
    }

    /**
     * Handle request to update the score of a match.
     */
    async function updateScore(team1: boolean, add: boolean) {
        const updatedRecord = {
            id: game?.id,
            team1score: game?.team1score + (team1 ? (add ? 1 : -1) : 0),
            team2score: game?.team2score + (team1 ? 0 : (add ? 1 : -1))
        };
        const updatedGame = await API.graphql({ query: updateGame, variables: {input: updatedRecord}});
        await setGame(updatedGame.data.updateGame);
    }

    /**
     * Determine bootstrap styling class for team card.
     */
    function cardColor(game, team1) {
        if(game && !game.complete && team1 === game.team1serves)
            return "bg-info"
        return "bg-light";
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
                        <Card style={{ width: '18rem' }} className={game?.complete && "bg-success"} >
                            <Card.Body>
                                <Card.Header>
                                    <h1 className="text-center">{game?.team1score} - {game?.team2score}</h1>
                                </Card.Header>
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
                                    <h5 className="text-center">{game?.player1name} & {game?.player2name}</h5>
                                </div>
                            </Row>
                            <Row>
                                <div className="flex-sm-column justify-content-center">
                                    <Button
                                        variant="success"
                                        size="lg"
                                        className="m-1"
                                        onClick={() => updateScore(true, true)}
                                    >+1</Button>
                                    <Button
                                        variant="primary"
                                        size="lg" className="m-1"
                                        onClick={() => giveServe(true)}
                                    >Give Serve</Button>
                                    <Button
                                        variant="danger"
                                        size="lg"
                                        className="m-1"
                                        onClick={() => updateScore(true, false)}
                                    >-1</Button>
                                </div>
                            </Row>
                        </Col>
                        <Col className={`card align-items-center p-4 m-2 ${cardColor(game, false)}`}>
                            <Row>
                                <h1 className="text-center">Team 2</h1>
                            </Row>
                            <Row>
                                <div className="d-flex justify-content-center">
                                    <h5 className="text-center">{game?.player3name} & {game?.player4name}</h5>
                                </div>
                            </Row>
                            <Row>
                                <div className="flex-sm-column justify-content-center">
                                    <Button
                                        variant="success"
                                        size="lg"
                                        className="m-1"
                                        onClick={() => updateScore(false, true)}
                                    >+1</Button>
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        className="m-1"
                                        onClick={() => giveServe(false)}
                                    >Give Serve</Button>
                                    <Button
                                        variant="danger"
                                        size="lg"
                                        className="m-1"
                                        onClick={() => updateScore(false, false)}
                                    >-1</Button>
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