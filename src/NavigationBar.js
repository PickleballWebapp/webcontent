import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function NavigationBar({ signOut }) {
  //todo - conditionally render game start page

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
            <NavDropdown title="Scores" id="basic-nav-dropdown">
              <Link className="dropdown-item" to="/scores">
                Game Scores
              </Link>
              <Link className="dropdown-item" to="/rankings">
                Rankings
              </Link>
              <NavDropdown.Divider />
              <Link className="dropdown-item" to="/user">
                My Profile
              </Link>
            </NavDropdown>
          </Nav>
          <Nav>
            <Nav.Link onClick={signOut}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
