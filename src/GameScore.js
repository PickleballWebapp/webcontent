import { Card, Col, Container, Row, Button, Modal } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { API } from "aws-amplify";
import { getGame, getUser } from "./graphql/queries";
import { useNavigate, useParams } from "react-router-dom";
import { deleteGame, updateGame, updateUser } from "./graphql/mutations";
import { UserType } from "./models";

export default function GameScore({ user }) {
  let navigate = useNavigate();
  let { id } = useParams();
  const [game, setGame] = useState();
  const [showCompleteModal, setCompleteModal] = useState(false);
  const [showDeleteModal, setDeleteModal] = useState(false);

  const openCompleteModal = () => setCompleteModal(true);
  const closeCompleteModal = () => setCompleteModal(false);
  const openDeleteModal = () => setDeleteModal(true);
  const closeDeleteModal = () => setDeleteModal(false);
  const giveServeTeam1 = () => giveServe(true);
  const giveServeTeam2 = () => giveServe(false);
  const team1Add = () => updateScore(true, true);
  const team1Subtract = () => updateScore(true, false);
  const team2Add = () => updateScore(false, true);
  const team2Subtract = () => updateScore(false, false);

  /**
   * Fetch information about game ID passed via state.
   */
  useEffect(() => {
    async function fetchGame() {
      const apiData = await API.graphql({
        query: getGame,
        variables: { id: id },
      });
      setGame(apiData.data.getGame);
    }
    fetchGame();
  }, [id]);

  /**
   * Handle request to give serve to other team.
   */
  async function giveServe(team1: boolean) {
    const updatedRecord = {
      id: id,
      team1serves: team1,
    };
    const apiData = await API.graphql({
      query: updateGame,
      variables: { input: updatedRecord },
    });
    await setGame(apiData.data.updateGame);
  }

  /**
   * Handle request to update the score of a match.
   */
  async function updateScore(team1: boolean, add: boolean) {
    const updatedRecord = {
      id: id,
      team1score:
        game?.team1score +
        (team1 ? (add ? 1 : game?.team1score === 0 ? 0 : -1) : 0),
      team2score:
        game?.team2score +
        (team1 ? 0 : add ? 1 : game?.team2score === 0 ? 0 : -1),
    };
    const apiData = await API.graphql({
      query: updateGame,
      variables: { input: updatedRecord },
    });
    await setGame(apiData.data.updateGame);
  }

  /**
   * Handle request to mark game as complete.
   */
  async function handleCompleteGame() {
    const updatedRecord = {
      id: id,
      complete: true,
    };

    const apiData = await API.graphql({
      query: updateGame,
      variables: { input: updatedRecord },
    });
    await setGame(apiData.data.updateGame);
    setCompleteModal(false);

    await setWinsLosses(game.player1, game.team1score > game.team2score);
    await setWinsLosses(game.player2, game.team1score > game.team2score);
    await setWinsLosses(game.player3, game.team1score < game.team2score);
    await setWinsLosses(game.player4, game.team1score < game.team2score);
  }

  /**
   * Set the players' wins and losses accordingly upon completion.
   */
  async function setWinsLosses(username, winner: boolean) {
    const userData = (
      await API.graphql({
        query: getUser,
        variables: { id: username },
      })
    ).data.getUser;
    const userDetails = {
      id: username,
      wins: userData?.wins + (winner ? 1 : 0),
      losses: userData?.losses + (winner ? 0 : 1),
    };
    API.graphql({ query: updateUser, variables: { input: userDetails } });
  }

  /**
   * Handle request to delete game.
   */
  async function handleDeleteGame() {
    const gameDetails = {
      id: id,
    };
    await API.graphql({
      query: deleteGame,
      variables: { input: gameDetails },
    });
    navigate("/scores");
  }

  /**
   * Determine bootstrap styling class for team card.
   */
  function cardColor(game, team1: boolean) {
    if (game && !game.complete && team1 === game.team1serves) return "bg-info";
    return "bg-light";
  }

  return (
    <Container fluid>
      <Row>
        <Col />
        <Col lg={8} xs={12}>
          <h1 className="text-center p-3">Game Score</h1>
          <div className="d-flex justify-content-center">
            <Card
              style={{ width: "18rem" }}
              className={game?.complete && "bg-success"}
            >
              <Card.Body>
                <h1 className="text-center">
                  {game?.team1score} - {game?.team2score}
                </h1>
              </Card.Body>
            </Card>
          </div>
          <Row className="p-3">
            <Col
              className={`card align-items-center p-4 m-2 ${cardColor(
                game,
                true
              )}`}
            >
              <Row>
                <h1 className="text-center">Team 1</h1>
              </Row>
              <Row>
                <div className="d-flex justify-content-center">
                  <h5 className="text-center">
                    {game?.player1name} & {game?.player2name}
                  </h5>
                </div>
              </Row>
              {!game?.complete &&
                (user.type === UserType.ADMIN ||
                  user.type === UserType.SCORER) && (
                  <Row>
                    <div className="flex-sm-column justify-content-center">
                      <Button
                        variant="success"
                        size="lg"
                        className="m-1"
                        onClick={team1Add}
                      >
                        +1
                      </Button>
                      <Button
                        variant="primary"
                        size="lg"
                        className="m-1"
                        onClick={giveServeTeam1}
                      >
                        Give Serve
                      </Button>
                      <Button
                        variant="danger"
                        size="lg"
                        className="m-1"
                        onClick={team1Subtract}
                      >
                        -1
                      </Button>
                    </div>
                  </Row>
                )}
            </Col>
            <Col
              className={`card align-items-center p-4 m-2 ${cardColor(
                game,
                false
              )}`}
            >
              <Row>
                <h1 className="text-center">Team 2</h1>
              </Row>
              <Row>
                <div className="d-flex justify-content-center">
                  <h5 className="text-center">
                    {game?.player3name} & {game?.player4name}
                  </h5>
                </div>
              </Row>
              {!game?.complete &&
                (user.type === UserType.ADMIN ||
                  user.type === UserType.SCORER) && (
                  <Row>
                    <div className="flex-sm-column justify-content-center">
                      <Button
                        variant="success"
                        size="lg"
                        className="m-1"
                        onClick={team2Add}
                      >
                        +1
                      </Button>
                      <Button
                        variant="primary"
                        size="lg"
                        className="m-1"
                        onClick={giveServeTeam2}
                      >
                        Give Serve
                      </Button>
                      <Button
                        variant="danger"
                        size="lg"
                        className="m-1"
                        onClick={team2Subtract}
                      >
                        -1
                      </Button>
                    </div>
                  </Row>
                )}
            </Col>
          </Row>
          <div className="d-flex justify-content-center">
            {!game?.complete &&
              (user.type === UserType.ADMIN ||
                user.type === UserType.SCORER) && (
                <React.Fragment>
                  <Button
                    className="m-1"
                    variant="outline-primary"
                    onClick={openCompleteModal}
                  >
                    Mark Game as Completed
                  </Button>
                  <Modal show={showCompleteModal} onHide={closeCompleteModal}>
                    <Modal.Header closeButton>
                      <Modal.Title>Confirm Game Completion</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      Game completion is not reversible. Are you sure?
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={closeCompleteModal}>
                        Cancel
                      </Button>
                      <Button
                        data-testid="confirm-completion"
                        variant="primary"
                        onClick={handleCompleteGame}
                      >
                        Confirm Completion
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </React.Fragment>
              )}
            {user.type === UserType.ADMIN && (
              <React.Fragment>
                <Button
                  className="m-1"
                  variant="outline-danger"
                  onClick={openDeleteModal}
                >
                  Delete Game
                </Button>
                <Modal show={showDeleteModal} onHide={closeDeleteModal}>
                  <Modal.Header closeButton>
                    <Modal.Title>Confirm Game Deletion</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Game deletion is not reversible. Are you sure?
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={closeDeleteModal}>
                      Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteGame}>
                      Confirm Deletion
                    </Button>
                  </Modal.Footer>
                </Modal>
              </React.Fragment>
            )}
          </div>
        </Col>
        <Col />
      </Row>
    </Container>
  );
}
