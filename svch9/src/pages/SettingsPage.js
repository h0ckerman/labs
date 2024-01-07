import React, { useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';

const SettingsPage = () => {
    const [userData, setUserData] = useState({
        username: 'john_doe',
        email: 'john.doe@example.com',
        receiveNotifications: true,
        darkMode: false,
    });

    const handleSaveClick = () => {
        console.log('Updated User Settings:', userData);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const inputValue = type === 'checkbox' ? checked : value;

        setUserData((prevData) => ({
            ...prevData,
            [name]: inputValue,
        }));
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
