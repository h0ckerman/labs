import React from 'react';
import { Link } from 'react-router-dom';
import '../css/WelcomePage.css';

const WelcomePage = () => {
  return (
    <div className="welcome-container">
      <h1>Welcome to Career Guidance App</h1>
      <p>
        Your journey to a successful career begins here! Explore our resources,
        get personalized guidance, and make informed decisions for a bright
        future.
      </p>
      <div className="feature-section">
        <div className="feature">
          <h2>Explore Careers</h2>
          <p>Discover various career paths and find the one that suits you.</p>
        </div>
        <div className="feature">
          <h2>Guidance Tools</h2>
          <p>Utilize our tools to get personalized career advice and insights.</p>
        </div>
        <div className="feature">
          <h2>Job Search</h2>
          <p>Search and apply for jobs that match your skills and interests.</p>
        </div>
      </div>
      <div className="list-link">
        <Link to="/list">List Visits</Link>
      </div>
    </div>
  );
};

export default WelcomePage;
