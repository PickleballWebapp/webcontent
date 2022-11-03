import React from "react";
import { Nav, Navbar } from "rsuite";
import { Link } from "react-router-dom";
import MemberIcon from "@rsuite/icons/Member";
import { UserType } from "./models";

const NavLink = React.forwardRef(({ href, children, ...rest }, ref) => (
  <Link ref={ref} to={href} {...rest}>
    {children}
  </Link>
));

export default function NavigationBar({ signOut, user, onSelect, activeKey }) {
  return (
    <Navbar appearance="subtle">
      <Navbar.Brand as={NavLink} href="/home" style={{ fontWeight: "bolder" }}>
        Vandy Pickleball
      </Navbar.Brand>
      <Nav onSelect={onSelect} activeKey={activeKey}>
        <Nav.Item as={NavLink} href="/scheduling" eventKey="2">
          Schedule
        </Nav.Item>
        <Nav.Item as={NavLink} href="/scores" eventKey="3">
          Game Scores
        </Nav.Item>
        <Nav.Item as={NavLink} href="/rankings" eventKey="4">
          Rankings
        </Nav.Item>
        {user?.type === UserType.ADMIN && (
          <Nav.Menu title="Admin">
            <Nav.Item as={NavLink} href="/new" eventKey="5">
              New Game
            </Nav.Item>
            <Nav.Item as={NavLink} href="/schedule" eventKey="6">
              Schedule Round Robin
            </Nav.Item>
          </Nav.Menu>
        )}
      </Nav>
      <Nav pullRight onSelect={onSelect} activeKey={activeKey}>
        <Nav.Item
          as={NavLink}
          href={`/user/${user?.id}`}
          icon={<MemberIcon />}
          eventKey="7"
        >
          My Profile
        </Nav.Item>
        <Nav.Item onClick={signOut}>Logout</Nav.Item>
      </Nav>
    </Navbar>
  );
}
