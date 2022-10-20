import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { API, Auth } from "aws-amplify";
import { getGame, getUser } from "./graphql/queries";
import { gameTable } from "./Utils";

export default function User() {
  //todo - conditionally render user modification stuff (just user type) for admins
  //todo - conditionally render delete user for admins

  const location = useLocation();
  let { user } = location.state || { user: null };
  const [userData, setUserData] = useState();
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetchUserData();
    //eslint-disable-next-line
  }, []);

  /**
   * Fetch user data for either the player ID (passed via state) or for
   * the current authenticated user (if state is empty).
   */
  async function fetchUserData() {
    user = user || (await Auth.currentAuthenticatedUser()).username;
    const userData = await API.graphql({
      query: getUser,
      variables: { id: user },
    });
    setUserData(userData.data.getUser);

    let gameDataList = [];
    for (const game of userData.data.getUser.games || []) {
      gameDataList.push(
        (await API.graphql({ query: getGame, variables: { id: game } }))?.data
          ?.getGame
      );
    }
    setGames(gameDataList);
  }

  return (
    <Row>
      <Col sm={2} />
      <Col sm={8}>
        <h1>{userData?.name}'s Player Profile</h1>
        <Row>
          <Col sm={2}>
            <h6>Email:</h6>
          </Col>
          <Col>
            <p>{userData?.email}</p>
          </Col>
        </Row>
        <Row>
          <Col sm={2}>
            <h6>Wins:</h6>
          </Col>
          <Col>
            <p>{userData?.wins}</p>
          </Col>
        </Row>
        <Row>
          <Col sm={2}>
            <h6>Losses:</h6>
          </Col>
          <Col>
            <p>{userData?.losses}</p>
          </Col>
        </Row>
        <br />
        <h4>{userData?.name}'s games</h4>
        {gameTable(games)}
      </Col>
      <Col sm={2} />
    </Row>
  );
}
