import {Card, Col, Container, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";

export default function Home() {
    return (
       // <h1 align="center">Welcome to the Pickleball Web App</h1>
        <Container fluid>
            <Row>
                <Col />
                <Col xs={8}>
                    <Row>
                        <h1 className="text-center p-5">
                            Vanderbilt Pickleball App
                        </h1>
                        <Col>
                            <Card style={{ width: '18rem' }}>
                                <Card.Body>
                                    <Card.Title className="text-center">Scores</Card.Title>
                                    <Card.Text>
                                        Keep score of your pickleball game!
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
                        <Row>
                            {/* might want to add a login button but already have it in the top right*/}
                        </Row>
                    </Row>
                </Col>
                <Col />
            </Row>
        </Container>
    );
}