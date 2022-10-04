import {Card, Col, Container, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";

export default function Scores() {
    return (
        <Container fluid>
            <Row>
               <Col />
               <Col xs={8}>
                   <h1 className="text-center p-5">
                       Scoreboard
                   </h1>
                   <div className="d-flex justify-content-center">
                       <Card style={{ width: '18rem' }} >
                           <Card.Body>
                               <Card.Text>
                                   <h1 className="text-center">
                                       5-0
                                   </h1>
                               </Card.Text>
                           </Card.Body>
                       </Card>
                   </div>
                   <Row>
                       <Col>
                           <h2 className="text-center p-5">
                               Team 1
                           </h2>
                           <Row>
                               <Col>
                                   <h4 className="text-center">
                                       Sam Feifer
                                   </h4>
                               </Col>
                               <Col>
                                   <h4 className="text-center">
                                       Nick Tilson
                                   </h4>
                               </Col>
                           </Row>
                           <Row>
                               <Col>
                                   <Button variant="success">Add Point</Button>{' '}
                               </Col>
                               <Col>
                                   <Button variant="primary">Give Serve</Button>{' '}
                               </Col>
                               <Col>
                                   <Button variant="danger">Subtract Point</Button>{' '}
                               </Col>
                           </Row>
                       </Col>
                       <Col>
                           <h2 className="text-center p-5">
                               Team 2
                           </h2>
                           <Row>
                               <Col>
                                   <h4 className="text-center">
                                       Owen McCarthy
                                   </h4>
                               </Col>
                               <Col>
                                   <h4 className="text-center">
                                       Jack Harrington
                                   </h4>
                               </Col>
                           </Row>
                           <Row>
                               <Col>
                                   <Button variant="success">Add Point</Button>{' '}
                               </Col>
                               <Col>
                                   <Button variant="primary">Give Serve</Button>{' '}
                               </Col>
                               <Col>
                                   <Button variant="danger">Subtract Point</Button>{' '}
                               </Col>
                           </Row>
                       </Col>
                   </Row>
               </Col>
                <Col />
            </Row>
        </Container>
    );
}