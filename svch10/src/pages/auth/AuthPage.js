import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from '../../redux/actions';

const AuthPage = () => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isRegistration, setIsRegistration] = useState(false);

    const handleAuth = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:3001/${isRegistration ? 'register' : 'login'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            localStorage.setItem('token', result.token);
            dispatch(setUser({ username, email }));

            setShowModal(true);
            setModalMessage(`User ${isRegistration ? 'registered' : 'authenticated'} successfully! Token: ${result.token}`);
        } catch (error) {
            console.error('Error:', error);
            setShowModal(true);
            setModalMessage('An error occurred. Please try again.');
            dispatch(clearUser());

        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handlePasswordRecovery = () => {
        setShowModal(true);
        setModalMessage('Password recovery email sent!');
    };


    return (
        <Container>
            <Row className="justify-content-md-center mt-5">
                <Col md={6}>
                    <Form>
                        <Form.Group controlId="formBasicUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                value={username}
                                id="username"
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                id="email"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        {isRegistration && (
                            <Form.Group controlId="formBasicPasswordConfirmation">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control type="password" placeholder="Confirm Password" required />
                            </Form.Group>
                        )}

                        <Button variant="primary" onClick={handleAuth}>
                            {isRegistration ? 'Register' : 'Login'}
                        </Button>

                        {isRegistration && (
                            <Button variant="link" onClick={handlePasswordRecovery}>
                                Forgot Password?
                            </Button>
                        )}

                        {!isRegistration && (
                            <Button variant="link" onClick={() => setIsRegistration(true)}>
                                Create an account
                            </Button>
                        )}
                    </Form>
                </Col>
            </Row>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Body>{modalMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AuthPage;