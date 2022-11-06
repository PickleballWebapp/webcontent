import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { API } from "aws-amplify";
import { getGame, getUser } from "./graphql/queries";
import { GameTable, winRate } from "./Utils";
import { UserType } from "./models";
import { deleteUser, updateUser } from "./graphql/mutations";

export default function User({ user }) {
  let navigate = useNavigate();
  let { id } = useParams();
  const [userData, setUserData] = useState();
  const [games, setGames] = useState([]);
  const [showUserTypeModal, setUserTypeModal] = useState(false);
  const [showDeleteUserModal, setDeleteUserModal] = useState(false);
  const [newUserType, setNewUserType] = useState(UserType.PLAYER);

  /**
   * Fetch user data for either the player ID (passed via state) or for
   * the current authenticated user (if state is empty).
   */
  useEffect(() => {
    async function fetchUserData() {
      const userData = await API.graphql({
        query: getUser,
        variables: { id: id },
      });
      setUserData(userData.data.getUser);

      let gameDataList = [];
      for (const game of userData.data.getUser.games || []) {
        await API.graphql({
          query: getGame,
          variables: { id: game },
        })
          .then((response) => response.data.getGame)
          .then((data) => {
            if (data) {
              gameDataList.push(data);
            }
          });
      }
      setGames(gameDataList);
    }
    fetchUserData();
  }, [id]);

  /**
   * Handle request to change user's type.
   */
  const handleUserTypeChange = async () => {
    const userDetails = {
      id: id,
      type: newUserType,
    };
    const userData = await API.graphql({
      query: updateUser,
      variables: { input: userDetails },
    });
    setUserData(userData.data.updateUser);
    setUserTypeModal(false);
  };

  /**
   * Handle request to delete user.
   */
  const handleDeleteUser = async () => {
    const userDetails = {
      id: id,
    };
    await API.graphql({
      query: deleteUser,
      variables: { input: userDetails },
    });
    navigate("/rankings");
  };

  return (
    <Row>
      <Col sm={2} />
      <Col sm={8}>
        <h1>Player Profile</h1>
        <Row>
          <Col sm={2}>
            <h6>Name:</h6>
          </Col>
          <Col>
            <p>{userData?.name}</p>
          </Col>
        </Row>
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
            <h6>User Type:</h6>
          </Col>
          <Col>
            <p>{userData?.type}</p>
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
        <Row>
          <Col sm={2}>
            <h6>Win Rate:</h6>
          </Col>
          <Col>
            <p>{winRate(userData?.wins, userData?.losses)}%</p>
          </Col>
        </Row>
        {user?.type === UserType.ADMIN && (
          <Row>
            <Col>
              <Button
                className="m-0"
                variant="outline-secondary"
                onClick={() => setUserTypeModal(true)}
              >
                Change User Type
              </Button>
              <Button
                className="m-1"
                variant="outline-danger"
                onClick={() => setDeleteUserModal(true)}
              >
                Delete User
              </Button>
            </Col>
          </Row>
        )}
        <Modal show={showUserTypeModal} onHide={() => setUserTypeModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Change User Type</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Please select a new user type for {userData?.name}:
            <Form>
              <Form.Group className="mb-2" controlId="changeUserType">
                <Form.Select
                  id="newUserType"
                  value={newUserType}
                  onChange={(event) => setNewUserType(event.target.value)}
                >
                  <option key="PLAYER" value={UserType.PLAYER}>
                    Player
                  </option>
                  <option key="SCORER" value={UserType.SCORER}>
                    Scorer
                  </option>
                  <option key="ADMIN" value={UserType.ADMIN}>
                    Admin
                  </option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setUserTypeModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => handleUserTypeChange()}>
              Confirm Change
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={showDeleteUserModal}
          onHide={() => setDeleteUserModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Delete User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete user {userData?.name}? This action
            cannot be undone.
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setDeleteUserModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={() => handleDeleteUser()}>
              Confirm Deletion
            </Button>
          </Modal.Footer>
        </Modal>
        <br />
        <h4>{userData?.name}'s games</h4>
        {GameTable(games)}
      </Col>
      <Col sm={2} />
    </Row>
  );
}
