import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const userProfile = {
  username: 'JohnDoe',
};

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/list', label: 'Visits' },
  { to: '/about', label: 'About' },
  { to: '/employees', label: 'Employees' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact Us' },
];

const profileLinks = [
  { to: '/profile', label: 'Profile' },
  { to: '/settings', label: 'Settings' },
  { to: '/logout', label: 'Logout' },
];

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          {navLinks.map((link, index) => (
            <Nav.Link key={index} as={Link} to={link.to}>
              {link.label}
            </Nav.Link>
          ))}
        </Nav>
        <Nav className="ml-auto">
          <Nav.Link as={Link} to="/profile">
            {userProfile.username}
          </Nav.Link>
          <NavDropdown title="Profile" id="basic-nav-dropdown">
            {profileLinks.map((link, index) => (
              <NavDropdown.Item key={index} as={Link} to={link.to}>
                {link.label}
              </NavDropdown.Item>
            ))}
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
