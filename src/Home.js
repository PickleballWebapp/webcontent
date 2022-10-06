import {Card, Col, Container, Row} from "react-bootstrap";

export default function Home({user}) {
    return (
        <Container fluid>
            <Row>
                <Col />
                <Col xs={8}>
                    <Row>
                        <h1 className="text-center p-5">
                            Welcome, {user.attributes.name}!
                        </h1>
                        <Col>
                            <Card style={{ width: '18rem' }}>
                                <Card.Body>
                                    <Card.Title className="text-center">Scores</Card.Title>
                                    <Card.Text>
                                        Keep score of your Pickleball game!
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card style={{ width: '18rem' }}>
                                <Card.Body>
                                    <Card.Title className="text-center">Schedule</Card.Title>
                                    <Card.Text>
                                        Schedule games with other members!
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card style={{ width: '18rem' }}>
                                <Card.Body>
                                    <Card.Title className="text-center">Rankings</Card.Title>
                                    <Card.Text>
                                        Check on the current rankings of members!
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <Col />
            </Row>
        </Container>
    );
}