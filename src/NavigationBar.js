import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";

export default function NavigationBar({signOut}) {
    return (
        <Navbar bg="light" expand="md">
            <Container>
                <Navbar.Brand href="/">Vandy Pickleball</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/home">Home</Nav.Link>
                        <Nav.Link href="/scheduling">Scheduling</Nav.Link>
                        <NavDropdown title="Scores" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/scores">Game Scores</NavDropdown.Item>
                            <NavDropdown.Item href="/rankings">Rankings</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="/user">My Profile</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <Nav.Link onClick={signOut}>
                            Logout
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}