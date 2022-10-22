import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function NavigationBar({ signOut, user }) {
  return (
    <Navbar bg="light" expand="md">
      <Container>
        <Link className="navbar-brand" to="/home">
          Vandy Pickleball
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link className="nav-link" to="/home">
              Home
            </Link>
            <Link className="nav-link" to="/scheduling">
              Scheduling
            </Link>
            <Link className="nav-link" to="/scores">
              Game Scores
            </Link>
            <Link className="nav-link" to="/rankings">
              Rankings
            </Link>
          </Nav>
          <Nav>
            <Link className="nav-link" to={`/user/${user?.id}`}>
              My Profile
            </Link>
            <Nav.Link onClick={signOut}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
