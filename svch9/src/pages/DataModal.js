import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Col, Row } from 'react-bootstrap';

const DataModal = ({ isOpen, data, onClose, setData }) => {
    const [availableEmployees, setAvailableEmployees] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        employees: [],
    });
    const [employeeData, setEmployeeData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/employees')
            .then((response) => response.json())
            .then((employeeData) => {
                setAvailableEmployees(employeeData);
                setEmployeeData(employeeData);
            })
            .catch((error) => console.error('Error fetching employees:', error));

        if (isOpen && data) {
            fetch(`http://localhost:3001/visits/${data.id}`)
                .then((response) => response.json())
                .then((selectedEntry) => {
                    console.log(selectedEntry)
                    setFormData({
                        title: selectedEntry.title,
                        description: selectedEntry.description,
                        employees: selectedEntry.Employees || [],
                    });
                })
                .catch((error) => console.error('Error fetching selected entry:', error));
        } else {
            setFormData({
                title: '',
                description: '',
                employees: [],
            });
        }
    }, [isOpen, data]);

    const assignedEmployeeIds = formData.employees.map(employee => employee.id);
    const filteredAvailableEmployees = availableEmployees.filter(
        (employee) => !assignedEmployeeIds.includes(employee.id)
    );

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const url = data ? `http://localhost:3001/visits/${data.id}` : 'http://localhost:3001/visits';

        fetch(url, {
            method: data ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: formData }),
        })
            .then((response) => response.json())
            .then((jsonData) => {
                console.log('Data saved:', jsonData);
                onClose();
            })
            .catch((error) => console.error('Error saving data:', error));
    };

    const handleAssignEmployee = (employeeId) => {
        const url = `http://localhost:3001/employee-visits`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                visitId: data.id,
                employeeId,
            }),
        })
            .then((response) => response.json())
            .then((jsonData) => {
                console.log('Employee assigned:', jsonData);

                setAvailableEmployees((prevEmployees) =>
                    prevEmployees.filter((employee) => employee.id !== employeeId)
                );

                setFormData((prevFormData) => ({
                    ...prevFormData,
                    employees: [...prevFormData.employees, { id: employeeId }],
                }));
            })
            .catch((error) => console.error('Error assigning employee:', error));
    };

    const handleDeassignEmployee = (employeeId) => {
        const url = `http://localhost:3001/employee-visits`;

        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                visitId: data.id,
                employeeId,
            }),
        })
            .then((response) => response.json())
            .then((jsonData) => {
                console.log('Employee deassigned:', jsonData);

                if (!availableEmployees.some((employee) => employee.id === employeeId)) {
                    setAvailableEmployees((prevEmployees) => {
                        const existingEmployee = employeeData.find((employee) => employee.id === employeeId);
                        return existingEmployee ? [...prevEmployees, existingEmployee] : prevEmployees;
                    });
                }

                setFormData((prevFormData) => ({
                    ...prevFormData,
                    employees: prevFormData.employees.filter((employee) => employee.id !== employeeId),
                }));
            })
            .catch((error) => console.error('Error deassigning employee:', error));
    };


    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{data ? 'Edit Data' : 'Add Data'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formTitle">
                        <Form.Label>Title:</Form.Label>
                        <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="formDescription">
                        <Form.Label>Description:</Form.Label>
                        <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="formEmployees">
                        <Form.Label className="label-employees">Employees:</Form.Label>
                        <div className="employee-container">
                            {formData.employees.length > 0 ? (
                                formData.employees.map((employee) => (
                                    <Row key={employee.id} className="employee-item">
                                        <Col>
                                            <span className="employee-name">{employee.name}</span>
                                        </Col>
                                        <Col>
                                            <Button variant="danger" onClick={() => handleDeassignEmployee(employee.id)}>
                                                Deassign
                                            </Button>
                                        </Col>
                                    </Row>
                                ))
                            ) : (
                                <div className="no-employees-message">No employees assigned</div>
                            )}
                        </div>
                    </Form.Group>
                    <Form.Group controlId="formAvailableEmployees">
                        <Form.Label className="label-available-employees">Available Employees:</Form.Label>
                        <div className="available-employee-container">
                            {filteredAvailableEmployees.map((employee, index) => (
                                <Row key={`available-${employee.id}-${index}`} className="available-employee-item">
                                    <Col>
                                        <span className="available-employee-name">{employee.name}</span>
                                    </Col>
                                    <Col>
                                        <Button variant="success" onClick={() => handleAssignEmployee(employee.id)}>
                                            Assign
                                        </Button>
                                    </Col>
                                </Row>
                            ))}
                        </div>
                    </Form.Group>
                    <Button type="submit" variant="primary">
                        {data ? 'Save Changes' : 'Add Data'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>

    );
};

export default DataModal;