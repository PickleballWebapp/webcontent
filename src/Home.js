import { Col, Container, Row } from "react-bootstrap";

export default function Home({ user }) {
  return (
    <Container fluid>
      <Row>
        <Col />
        <Col xs={10} lg={8}>
          <Row>
            <h1 className="text-center p-5">Welcome, {user?.name}!</h1>
          </Row>
        </Col>
        <Col />
      </Row>
    </Container>
  );
}
