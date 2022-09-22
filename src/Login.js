import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {Col, Container, FloatingLabel, FormGroup, Row} from "react-bootstrap";

export default function Login() {
    return (
        <Container fluid>
            <Row>
                <Col />
                <Col xs={4}>
                    <Form>
                        <Row className="card align-items-center bg-light">
                            <Col>
                                <FormGroup>
                                    <FloatingLabel
                                        controlId="floatingInput"
                                        label="Email address"
                                        className="p-1 mt-2"
                                    >
                                        <Form.Control type="email" placeholder="name@example.com" />
                                    </FloatingLabel>
                                </FormGroup>
                                <FormGroup>
                                    <FloatingLabel
                                        controlId="formBasicPassword"
                                        label="Password"
                                        className="p-1"
                                    >
                                        <Form.Control type="password" placeholder="12345678" />
                                    </FloatingLabel>
                                </FormGroup>
                                <div className="d-grid gap-2">
                                    <Button className="m-1 mb-3" variant="primary" type="submit">
                                        Login
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col />
            </Row>
        </Container>
    );
}