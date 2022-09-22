import React from 'react';
import {useLocation} from "react-router-dom";
import {Col, Container, Row, Table} from "react-bootstrap";
import Button from "react-bootstrap/Button";

export default function User() {
    let user = useQuery().get("user")

    if(user) {
        return printDifferentUser(user)
    } else return printCurrentUser();
}

function printCurrentUser() {
    return(
        <Row>
            <Col sm={2} />
            <Col sm={8}>
                <h1>Your User Profile</h1>
                <Row>
                    <Col sm={2}>
                        <h6>First name:</h6>
                    </Col>
                    <Col>
                        <p>first name</p>
                    </Col>
                </Row>
                <Row>
                    <Col sm={2}>
                        <h6>Last name:</h6>
                    </Col>
                    <Col>
                        <p>last name</p>
                    </Col>
                </Row>
                <Row>
                    <Col sm={2}>
                        <h6>Email:</h6>
                    </Col>
                    <Col>
                        <p>abc@123.com</p>
                    </Col>
                </Row>
                <Row>
                    <Col sm={2}>
                        <h6>Last login:</h6>
                    </Col>
                    <Col>
                        <p>Today</p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button variant="outline-danger">Delete account</Button>
                    </Col>
                </Row>
                <br />
                <h4>Your past games</h4>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Username</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>1</td>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                    </tr>
                    <tr>
                        <td colSpan={4}>You have no recorded games!</td>
                    </tr>
                    </tbody>
                </Table>
            </Col>
            <Col sm={2} />
        </Row>
    );
}

function printDifferentUser(user: String) {
    return(
        <Row>
            <Col sm={2} />
            <Col sm={8}>
                <h1>{user}'s User Profile</h1>
                <Row>
                    <Col sm={2}>
                        <h6>First name:</h6>
                    </Col>
                    <Col>
                        <p>first name</p>
                    </Col>
                </Row>
                <Row>
                    <Col sm={2}>
                        <h6>Last name:</h6>
                    </Col>
                    <Col>
                        <p>last name</p>
                    </Col>
                </Row>
                <br />
                <h4>{user}'s past games</h4>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Username</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>1</td>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                    </tr>
                    <tr>
                        <td colSpan={4}>{user} has no recorded games!</td>
                    </tr>
                    </tbody>
                </Table>
            </Col>
            <Col sm={2} />
        </Row>
    );
}

// Collects the query parameters from the URI route
function useQuery() {
    const {search} = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}
