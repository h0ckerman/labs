import React, { useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../redux/actions';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleSaveClick = () => {
    // Check if newPassword is empty
    if (!newPassword.trim()) {
      console.error('New password cannot be empty.');
      return;
    }

    fetch('http://127.0.0.1:3001/changepassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: userData.username,
        currentPassword,
        newPassword,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log('Password changed successfully:', result);
        dispatch(setUser({ ...userData, password: result.newPassword }));
      })
      .catch((error) => {
        console.error('Error changing password:', error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

    dispatch(setUser({ ...userData, [name]: inputValue }));
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h2>Account Settings</h2>
          <Form>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" value={userData.username} readOnly />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={userData.email} readOnly />
            </Form.Group>
            <Form.Group controlId="formReceiveNotifications">
              <Form.Check
                type="checkbox"
                label="Receive Notifications"
                name="receiveNotifications"
                checked={userData.receiveNotifications}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formDarkMode">
              <Form.Check
                type="checkbox"
                label="Dark Mode"
                name="darkMode"
                checked={userData.darkMode}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formCurrentPassword">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formNewPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formConfirmNewPassword">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleSaveClick}>
              Save Changes
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SettingsPage;
