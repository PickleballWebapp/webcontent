import { Col, Container, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { API } from "aws-amplify";
import { listGames } from "./graphql/queries";
import { gameTable } from "./Utils";
import { UserType } from "./models";

export default function Scores({ user }) {
  const [games, setGames] = useState([]);

  /**
   * Fetch list of all games, both active and complete.
   */
  useEffect(() => {
    async function fetchGames() {
      const apiData = await API.graphql({ query: listGames });
      setGames(apiData.data.listGames.items);
    }
    fetchGames();
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col />
        <Col xs={12} lg={8}>
          <h1 className="text-center p-5">Game Scores</h1>
          {gameTable(
            games,
            user?.type === UserType.ADMIN || user?.type === UserType.SCORER
          )}
        </Col>
        <Col />
      </Row>
    </Container>
  );
}
