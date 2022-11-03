import { Col, Container, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { API } from "aws-amplify";
import { listGames } from "./graphql/queries";

export default function Scheduling() {
  const [games, setGames] = useState([]);

  /**
   * Fetch list of all games, both active and complete.
   */
  useEffect(() => {
    async function fetchGames() {
      const apiData = await API.graphql({ query: listGames });
      await setGames(apiData.data.listGames.items);
    }
    fetchGames();
  }, []);

  return (
    <Container fluid>
      <Row>
        <h1 className="text-center p-5">Schedule of Games</h1>
        <Col />
        <Col xs={8}></Col>
        <Col />
      </Row>
    </Container>
  );
}
