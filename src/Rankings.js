import { Col, Container, Row, Table } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { listUsers } from "./graphql/queries";
import { useNavigate } from "react-router-dom";
import { comparator, winRate } from "./Utils";

export default function Rankings() {
  let navigate = useNavigate();
  const [users, setUsers] = useState([]);

  /**
   * Fetch all users registered in system.
   */
  useEffect(() => {
    async function fetchUsers() {
      const apiData = await API.graphql({ query: listUsers });
      setUsers(apiData.data?.listUsers.items);
    }
    fetchUsers();
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col />
        <Col xs={12} lg={8}>
          <h1 className="text-center p-5">Rankings</h1>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Record (W-L)</th>
                <th>Win Rate</th>
              </tr>
            </thead>
            <tbody>
              {[...users].sort(comparator).map((user, index) => (
                <tr
                  key={user.id}
                  onClick={() => navigate(`/user/${user?.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>
                    {user.wins}-{user.losses}
                  </td>
                  <td>{winRate(user.wins, user.losses)}%</td>
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
