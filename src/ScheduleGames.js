import {
  Alert,
  Col,
  Container,
  Fade,
  Row,
  Table,
  Form,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { UserType } from "./models";
import { API } from "aws-amplify";
import { listUsers } from "./graphql/queries";
import $ from "jquery";
import { genRoundRobin } from "./Utils";
import { Modal } from "react-bootstrap";

const userMap = new Map();

export default function ScheduleGames({ user }) {
  const [showAlert, setAlert] = useState(false);
  const [submissionModal, setModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [roundRobin, setRoundRobin] = useState([]);
  let navigate = useNavigate();
  const handleClose = () => setModal(false);

  /**
   * Validate that user is a scorer or admin. Fetch user list
   * to populate selector fields.
   */
  useEffect(() => {
    if (user.type !== UserType.ADMIN) {
      navigate("/scores");
    }
    async function fetchUsers() {
      await API.graphql({ query: listUsers }).then((response) => {
        setUsers(response.data.listUsers.items);
        response.data.listUsers.items.forEach((user) =>
          userMap.set(user.id, user.name)
        );
      });
    }
    fetchUsers();
  }, [navigate, user]);

  /**
   * Handle submission of the form.
   */
  async function handleSubmit() {
    // Validate existence of at least 2 teams
    if (teams.length < 2) {
      $("#alertBox").text(
        "There must be at least 2 teams to schedule a round robin."
      );
      setAlert(true);
      return;
    }

    // Validate completion of table
    let playerArray = [];
    for (const team of teams) {
      if (
        !team.user1 ||
        team.user1 === "empty" ||
        team.user1 === "" ||
        !team.user2 ||
        team.user2 === "empty" ||
        team.user2 === ""
      ) {
        $("#alertBox").text("Each team must have 2 players.");
        setAlert(true);
        return;
      }
      playerArray.push(team.user1);
      playerArray.push(team.user2);
    }

    // Validate player uniqueness
    if (new Set(playerArray).size !== playerArray.length) {
      $("#alertBox").text("All players must be unique. Please correct.");
      setAlert(true);
      return;
    }

    setAlert(false);

    setRoundRobin(genRoundRobin(teams));
    setModal(true);
  }

  /**
   * Add new team to input table.
   */
  const addInputRow = () => {
    const newTeam = {
      user1: "empty",
      user2: "empty",
    };
    setTeams([...teams, newTeam]);
  };

  /**
   * Delete team from input table.
   */
  const deleteInputRow = (index) => {
    const data = [...teams];
    data.splice(index, 1);
    setTeams(data);
  };

  /**
   * Handle change to team's players.
   */
  const handleChange = (index, event, user1: boolean) => {
    const { value } = event.target;
    const data = [...teams];
    data[index][`user${user1 ? "1" : "2"}`] = value;
    setTeams(data);
  };

  /**
   * Create games for round-robin.
   */
  const createGames = () => {
    console.log(roundRobin);
  };

  return (
    <Container fluid>
      <Row>
        <Col />
        <Col xs={10} lg={8}>
          <h1 className="text-center p-5">Schedule Games</h1>
          <Fade in={showAlert}>
            <div>
              <Alert variant="danger" id="alertBox"></Alert>
            </div>
          </Fade>
          <Row>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th className="text-center">Team</th>
                  <th className="text-center">Player 1</th>
                  <th className="text-center">Player 2</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((data, index) => {
                  const { user1, user2 } = data;
                  return (
                    <tr key={index}>
                      <td
                        className="text-center"
                        style={{ cursor: "not-allowed" }}
                        onClick={() => deleteInputRow(index)}
                      >
                        {index + 1}
                      </td>
                      <td>
                        <Form.Select
                          size="sm"
                          value={user1.id}
                          onChange={(event) => handleChange(index, event, true)}
                        >
                          <option key="empty" value="empty"></option>
                          {users.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.name}
                            </option>
                          ))}
                        </Form.Select>
                      </td>
                      <td>
                        {" "}
                        <Form.Select
                          size="sm"
                          value={user2.id}
                          onChange={(event) =>
                            handleChange(index, event, false)
                          }
                        >
                          <option key="empty" value="empty" name=""></option>
                          {users.map((user) => (
                            <option
                              key={user.id}
                              value={user.id}
                              name={user.name}
                            >
                              {user.name}
                            </option>
                          ))}
                        </Form.Select>
                      </td>
                    </tr>
                  );
                })}
                <tr key="newRow">
                  <td
                    colSpan={5}
                    className="text-center"
                    style={{ cursor: "pointer" }}
                    onClick={addInputRow}
                  >
                    Add Team
                  </td>
                </tr>
              </tbody>
            </Table>
          </Row>
          <div className="d-grid gap-2">
            <Button onClick={handleSubmit} className="mb-2">
              Review and Submit
            </Button>
          </div>
        </Col>
        <Col />
      </Row>
      <Modal show={submissionModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Confirm Round Robin Pairings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {roundRobin.map((games, round) => (
            <React.Fragment key={round}>
              <h5>Round {round + 1}</h5>
              <Table>
                <thead>
                  <tr>
                    <th>Team 1</th>
                    <th>Team 2</th>
                  </tr>
                </thead>
                <tbody>
                  {games.map((game, gameNum) => {
                    let team1 = game.team1
                      ? `${userMap.get(game.team1?.user1)} & ${userMap.get(
                          game.team1?.user2
                        )}`
                      : "BYE";
                    let team2 = game.team2
                      ? `${userMap.get(game.team2?.user1)} & ${userMap.get(
                          game.team2?.user2
                        )}`
                      : "BYE";

                    return (
                      <tr key={gameNum}>
                        <td>{team1}</td>
                        <td>{team2}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </React.Fragment>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            data-testid="confirm-creation"
            variant="primary"
            onClick={createGames}
          >
            Confirm Round Robin
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
