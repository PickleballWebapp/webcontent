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
import { useEffect, useState } from "react";
import { UserType } from "./models";
import { API } from "aws-amplify";
import { listUsers } from "./graphql/queries";
import $ from "jquery";

export default function ScheduleGames({ user }) {
  const [showAlert, setAlert] = useState(false);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  let navigate = useNavigate();

  /**
   * Validate that user is a scorer or admin. Fetch user list
   * to populate selector fields.
   */
  useEffect(() => {
    if (user.type !== UserType.ADMIN) {
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

    // todo -- Validate player uniqueness
    let playerArray = [];
    if (new Set(playerArray).size !== playerArray.length) {
      $("#alertBox").text("All players must be unique. Please correct.");
      setAlert(true);
      return;
    }

    //todo -- call round-robin algorithm
  }

  // todo -- use components and pass props (name) from array
  const addRow = () => {
    setTeams([...teams, [users[0], users[0]]]);
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
                  <th className="text-center">Player 1</th>
                  <th className="text-center">Player 2</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((players, index) => (
                  <tr key={index}>
                    <td>
                      <Form.Select size="sm">
                        <option>Small select</option>
                      </Form.Select>
                    </td>
                    <td>
                      {" "}
                      <Form.Select size="sm">
                        <option>Small select</option>
                      </Form.Select>
                    </td>
                  </tr>
                ))}
                <tr key="newRow">
                  <td
                    colSpan={5}
                    className="text-center"
                    style={{ cursor: "pointer" }}
                    onClick={addRow}
                  >
                    Add Team
                  </td>
                </tr>
              </tbody>
            </Table>
          </Row>
          <Button onClick={handleSubmit} className="mb-2">
            Submit
          </Button>
        </Col>
        <Col />
      </Row>
    </Container>
  );
}
