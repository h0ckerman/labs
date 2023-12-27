import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuHover = () => {
    setIsMenuOpen(true);
  };

  const handleMenuLeave = () => {
    setIsMenuOpen(false);
  };

  const userProfile = {
    username: 'JohnDoe',
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/list', label: 'Visits' },
    { to: '/about', label: 'About' },
    { to: '/employees', label: 'Employees' },
    { to: '/faq', label: 'FAQ' },
    { to: '/contact', label: 'Contact Us' }
  ];

  const profileLinks = [
    { to: '/profile', label: 'Profile' },
    { to: '/settings', label: 'Settings' },
    { to: '/logout', label: 'Logout' },
  ];

  return (
    <header className="header">
      <div className="nav">
        <ul>
          {navLinks.map((link, index) => (
            <li key={index}>
              <Link to={link.to}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div
        className="profile"
        onMouseEnter={handleMenuHover}
        onMouseLeave={handleMenuLeave}
      >
        <div className="profile-info">
          <span>{userProfile.username}</span>
        </div>

        {isMenuOpen && (
          <div className="profile-menu">
            <ul>
              {profileLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
