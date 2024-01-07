import React, { useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';

const UserProfilePage = () => {
    const [editMode, setEditMode] = useState(false);
    const [userData, setUserData] = useState({
        username: 'john_doe',
        email: 'john.doe@example.com',
        fullName: 'John Doe',
        bio: 'developer.',
    });

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleSaveClick = () => {
        setEditMode(false);
    };

    const handleCancelClick = () => {
        setEditMode(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col>
                    <h2>User Profile</h2>
                    {editMode ? (
                        <Form>
                            <Form.Group controlId="formUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter username"
                                    name="username"
                                    value={userData.username}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    name="email"
                                    value={userData.email}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formFullName">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter full name"
                                    name="fullName"
                                    value={userData.fullName}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formBio">
                                <Form.Label>Bio</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    placeholder="Enter bio"
                                    name="bio"
                                    value={userData.bio}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Button variant="primary" onClick={handleSaveClick}>
                                Save Changes
                            </Button>{' '}
                            <Button variant="secondary" onClick={handleCancelClick}>
                                Cancel
                            </Button>
                        </Form>
                    ) : (
                        <>
                            <p>
                                <strong>Username:</strong> {userData.username}
                            </p>
                            <p>
                                <strong>Email:</strong> {userData.email}
                            </p>
                            <p>
                                <strong>Full Name:</strong> {userData.fullName}
                            </p>
                            <p>
                                <strong>Bio:</strong> {userData.bio}
                            </p>
                            <Button variant="primary" onClick={handleEditClick}>
                                Edit Profile
                            </Button>
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default UserProfilePage;
