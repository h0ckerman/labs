import React from 'react';
import '../css/about.css';

function About() {
  return (
    <div className="about-container">
      <div className="about-content">
        <h2 className="about-heading">About Us</h2>
        <p className="about-text">
          Welcome to our application! Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Nulla facilisi. Quisque ac lectus eget nunc maximus lacinia at vel ipsum. Sed aliquam
          urna ac nunc rhoncus, et gravida tellus consectetur.
        </p>
        <p className="about-text">
          Curabitur in justo vitae justo bibendum bibendum. Vivamus et purus sit amet urna
          elementum tempus. Aenean eget neque vestibulum, congue turpis at, hendrerit sapien.
        </p>
      </div>
    </div>
  );
}

export default About;
