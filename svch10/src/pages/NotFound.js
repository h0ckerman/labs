import React from 'react';
import '../css/notFound.css';

function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-heading">404 - Not Found</h1>
        <p className="not-found-text">Sorry, the page you are looking for does not exist.</p>
      </div>
    </div>
  );
}

export default NotFound;
