import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const UserProfilePage = () => {
  const userData = useSelector((state) => state.user);

  return (
    <Container className="mt-5">
      <Row>
        <Col md={{ span: 6, offset: 3 }} className="bg-light p-4 rounded">
          <h2 className="text-center mb-4">User Profile</h2>
          <Row>
            <Col md={6}>
              <p className="font-weight-bold">Username:</p>
            </Col>
            <Col md={6}>
              <p>{userData.username}</p>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <p className="font-weight-bold">Email:</p>
            </Col>
            <Col md={6}>
              <p>{userData.email}</p>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfilePage;
