import {Col, Container, Row, Table} from "react-bootstrap";

export default function Rankings() {
    return (
        <Container fluid>
            <Row>
                <Col />
                <Col xs={8}>
                    <h1 className="text-center p-5">
                        Rankings
                    </h1>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Record (W-L)</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>1</td>
                            <td>Sam</td>
                            <td>Feifer</td>
                            <td>100-0</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Jack</td>
                            <td>Harrington</td>
                            <td>0-100</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>Joe</td>
                            <td>Napoli</td>
                            <td>0-0</td>
                        </tr>
                        </tbody>
                    </Table>
                </Col>
                <Col />
            </Row>
        </Container>
    );
}