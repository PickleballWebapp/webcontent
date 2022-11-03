import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { UserType } from "./models";

export default function ScheduleGames({ user }) {
  let navigate = useNavigate();
  useEffect(() => {
    if (user.type !== UserType.ADMIN) {
      navigate("/scores");
    }
  }, [navigate, user]);

  return (
    <Container fluid>
      <Row>
        <Col />
        <Col xs={10} lg={8}>
          <Row>
            <h1 className="text-center p-5">Schedule Games</h1>
          </Row>
        </Col>
        <Col />
      </Row>
    </Container>
  );
}
