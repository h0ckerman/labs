import React, { useEffect } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser, setUser } from '../redux/actions';
import { jwtDecode } from 'jwt-decode';

const Header = () => {
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.user);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken = jwtDecode(token);

      if (decodedToken) {
        dispatch(setUser({ username: decodedToken.username, email: decodedToken.email }));
      }
    }
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(clearUser());
  };

  const isAuthenticated = !!localStorage.getItem('token');

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/list', label: 'Visits' },
    { to: '/about', label: 'About' },
    { to: '/employees', label: 'Employees' },
    { to: '/faq', label: 'FAQ' },
    { to: '/contact', label: 'Contact Us' },
  ];

  const profileLinks =
    [
      { to: '/profile', label: 'Profile' },
      { to: '/settings', label: 'Settings' },
      { to: '/', label: 'Logout', onClick: handleLogout },
    ]

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
          {isAuthenticated ? (
            <>
              <NavDropdown title={userProfile.username} id="basic-nav-dropdown">
                {profileLinks.map((link, index) => (
                  <NavDropdown.Item key={index} as={Link} to={link.to} onClick={link.onClick}>
                    {link.label}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
            </>
          ) : (
            <>
              <Nav.Link as={Link} to="/auth">
                Login
              </Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
