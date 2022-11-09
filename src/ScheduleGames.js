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

    // todo -- call round-robin algorithm using teams array
    // todo -- call createGame for each result of the round-robin algo
  }

  /**
  * Generate a round robin tournament of form:
   * tournament[ROUND_#][GAME_#], with each game containing {team1: "TEAM1", team2: "TEAM2"}
   * So to get the second team of second game of the second round of the tournament:
   * game2Team2 = tourney[1][1].team2;
  * */
  const genRoundRobin = (teams) => {
    // add "BYE" if needed
    if (teams.length % 2 === 1) {
      teams.push(null);
    }

    const teamCount = teams.length;
    const rounds = teamCount - 1;
    const half = teamCount / 2;

    const tournamentPairings = [];

    // get indices so we can iter through our teams
    const teamIndexes = teams.map((_, i) => i).slice(1);

    for (let round = 0; round < rounds; round++) {
      const roundPairings = [];

      const newteamIndexes = [0].concat(teamIndexes);

      // get indices for first teams 1 and 2 this round
      const firstHalf = newteamIndexes.slice(0, half);
      const secondHalf = newteamIndexes.slice(half, teamCount).reverse();

      // pair our teams up and push as games
      for (let i = 0; i < firstHalf.length; i++) {
        roundPairings.push({
          team1: teams[firstHalf[i]],
          team2: teams[secondHalf[i]],
        });
      }

      // rotating the array to prepare for next round
      teamIndexes.push(teamIndexes.shift());
      tournamentPairings.push(roundPairings);
    }

    return tournamentPairings;
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
                          <option key="empty" value="empty"></option>
                          {users.map((user) => (
                            <option key={user.id} value={user.id}>
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
              Submit
            </Button>
          </div>
        </Col>
        <Col />
      </Row>
    </Container>
  );
}
