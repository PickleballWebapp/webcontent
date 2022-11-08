import { Col, Container, Row, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import { API } from "aws-amplify";
import { listGames } from "./graphql/queries";

export default function Scheduling() {
  const [games, setGames] = useState([]);

  /**
   * Fetch list of all games and filter out past games.
   */
  useEffect(() => {
    let today = new Date(new Date().toISOString().split("T")[0]);
    async function fetchGames() {
      const apiData = await API.graphql({ query: listGames });
      let filteredData = apiData.data.listGames.items.filter(
        (game) => today - 86400000 <= new Date(game.date) && !game.complete
      );
      await setGames(filteredData);
    }
    fetchGames();
  }, []);

  return (
    <Container fluid>
      <Row>
        <h1 className="text-center p-5">Upcoming Games</h1>
        <Col />
        <Col xs={8}>
          <Table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Team 1</th>
                <th>Team 2</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game, index) => (
                <tr key={index}>
                  <td>{game.date}</td>
                  <td>
                    {game.player1name} & {game.player2name}
                  </td>
                  <td>
                    {game.player3name} & {game.player4name}
                  </td>
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
