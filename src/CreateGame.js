import {
  Alert,
  Button,
  Col,
  Container,
  Fade,
  Form,
  Row,
} from "react-bootstrap";
import { listUsers } from "./graphql/queries";
import { useEffect, useState } from "react";
import { API } from "aws-amplify";
import $ from "jquery";
import { createGame } from "./graphql/mutations";
import { useNavigate } from "react-router-dom";
import { UserType } from "./models";
import { DatePicker } from "rsuite";
import {addGameToProfile} from "./Utils";

export default function CreateGame({ user }) {
  let navigate = useNavigate();
  const [showAlert, setAlert] = useState(false);
  const [users, setUsers] = useState([]);
  const [date, setDate] = useState();

  /**
   * Validate that user is a scorer or admin. Fetch user list
   * to populate selector fields.
   */
  useEffect(() => {
    if (user.type === UserType.PLAYER) {
      navigate("/scores");
    }
    async function fetchUsers() {
      setUsers(
        (await API.graphql({ query: listUsers })).data?.listUsers?.items
      );
    }
    fetchUsers();
  }, [navigate, user]);

  /**
   * Handle submission of the "create game" form.
   */
  async function handleSubmit() {
    let p1 = $("#player1");
    let p2 = $("#player2");
    let p3 = $("#player3");
    let p4 = $("#player4");
    let dateInput = date;

    // Validate player uniqueness
    let playerArray = [p1.val(), p2.val(), p3.val(), p4.val()];
    if (new Set(playerArray).size !== playerArray.length) {
      $("#alertBox").text("All four players must be unique. Please correct.");
      setAlert(true);
      return;
    }

    // Validate date format
    if (!dateInput.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/i)) {
      $("#alertBox").text(
        "Date must be in the form YYYY-MM-DD. Please correct."
      );
      setAlert(true);
      return;
    }

    // Compile game details
    const gameDetails = {
      complete: false,
      player1: p1.val(),
      player2: p2.val(),
      player3: p3.val(),
      player4: p4.val(),
      player1name: p1.find("option:selected").text(),
      player2name: p2.find("option:selected").text(),
      player3name: p3.find("option:selected").text(),
      player4name: p4.find("option:selected").text(),
      team1serves: true,
      team1score: 0,
      team2score: 0,
      date: dateInput,
    };

    // Post game to DynamoDB
    let playerList = [
      gameDetails.player1,
      gameDetails.player2,
      gameDetails.player3,
      gameDetails.player4,
    ];
    await API.graphql({ query: createGame, variables: { input: gameDetails } })
      .then(async (response) => {
        for (const player of playerList) {
          await addGameToProfile(player, response.data.createGame.id);
        }
        navigate(`/score/${response.data.createGame.id}`);
      })
      .catch((err) => console.log(err));
  }

  return (
    <Container fluid>
      <Row>
        <Col />
        <Col xs={12} lg={6}>
          <h1 className="text-center p-5">Create New Game</h1>
          <Fade in={showAlert}>
            <div>
              <Alert variant="danger" id="alertBox"></Alert>
            </div>
          </Fade>
          <Form>
            <Row>
              <Col className="card">
                <h5 className="d-flex justify-content-center">Team 1</h5>
                <Form.Group className="mb-2" controlId="selectplayer1">
                  <Form.Label>Player 1</Form.Label>
                  <Form.Select id="player1">
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-2" controlId="selectplayer2">
                  <Form.Label>Player 2</Form.Label>
                  <Form.Select id="player2">
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={1}>
                <div className="d-flex justify-content-center">
                  <h3>vs</h3>
                </div>
              </Col>
              <Col className="card">
                <h5 className="d-flex justify-content-center">Team 2</h5>
                <Form.Group className="mb-2" controlId="selectplayer3">
                  <Form.Label>Player 3</Form.Label>
                  <Form.Select id="player3">
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-2" controlId="selectplayer4">
                  <Form.Label>Player 4</Form.Label>
                  <Form.Select id="player4">
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col className="card mt-4">
                <Form.Group className="mt-3 mb-3 me-3">
                  <Form.Label>Game Date</Form.Label>
                  <DatePicker
                    className="ms-3"
                    oneTap
                    onChange={(d) => setDate(d?.toISOString().split("T")[0])}
                  />
                </Form.Group>
                <Button onClick={handleSubmit} className="mb-2">
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col />
      </Row>
    </Container>
  );
}
