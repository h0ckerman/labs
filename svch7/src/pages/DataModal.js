import React, { useState, useEffect } from 'react';
import '../css/DataModal.css';
import Button from '../components/button';

const DataModal = ({ isOpen, data, onClose, setData }) => {
    const [availableEmployees, setAvailableEmployees] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        employees: [],
    });
    const [employeeData, setEmployeeData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/api/employees')
            .then((response) => response.json())
            .then((employeeData) => {
                setAvailableEmployees(employeeData);
                setEmployeeData(employeeData);
            })
            .catch((error) => console.error('Error fetching employees:', error));

        if (isOpen && data) {
            fetch(`http://localhost:3001/api/data/${data.id}`)
                .then((response) => response.json())
                .then((selectedEntry) => {
                    setFormData({
                        title: selectedEntry.title,
                        description: selectedEntry.description,
                        employees: selectedEntry.employees || [],
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


    const assignedEmployeeIds = formData.employees;
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

        const url = data ? `http://localhost:3001/api/data/${data.id}` : 'http://localhost:3001/api/data';

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

                if (data) {
                    setData((prevData) =>
                        prevData.map((item) =>
                            item.id === data.id ? { ...item, ...jsonData.data } : item
                        )
                    );
                } else {
                    setData((prevData) => [...prevData, jsonData.data]);
                }

                onClose();
            })
            .catch((error) => console.error('Error saving data:', error));
    };

    const handleAssignEmployee = (employeeId) => {
        const url = `http://localhost:3001/api/employee`;

        fetch(url, {
            method: 'PUT',
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
                    employees: [...prevFormData.employees, employeeId],
                }));
                console.log(formData);
            })
            .catch((error) => console.error('Error assigning employee:', error));
    };

    const handleDeassignEmployee = (employeeId) => {
        const url = `http://localhost:3001/api/employee`;

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
                    employees: prevFormData.employees.filter((id) => id !== employeeId),
                }));
            })
            .catch((error) => console.error('Error deassigning employee:', error));
    };


    return (
        <div className={`modal ${isOpen ? 'open' : 'closed'}`}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>
                    &times;
                </span>
                <form onSubmit={handleSubmit}>
                    <label>Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                    <label className="label-employees">Employees:</label>
                    <div className="employee-container">
                        {formData.employees.length > 0 ? (
                            formData.employees.map((employeeId) => {
                                const employee = employeeData.find((e) => e.id === employeeId);
                                return (
                                    <div key={employeeId} className="employee-item">
                                        <span className="employee-name">{employee ? employee.name : 'Unknown Employee'}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleDeassignEmployee(employee.id)}
                                            className="employee-button"
                                        >
                                            Deassign
                                        </button>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="no-employees-message">No employees assigned</div>
                        )}
                    </div>

                    <label className="label-available-employees">Available Employees:</label>
                    <div className="available-employee-container">
                        {filteredAvailableEmployees.map((employee, index) => (
                            <div key={`available-${employee.id}-${index}`} className="available-employee-item">
                                <span className="available-employee-name">{employee.name}</span>
                                <button
                                    type="button"
                                    onClick={() => handleAssignEmployee(employee.id)}
                                    className="employee-button"
                                >
                                    Assign
                                </button>
                            </div>
                        ))}
                    </div>

                    <Button type="submit" label={data ? 'Save Changes' : 'Add Data'}></Button>
                </form>
            </div>
        </div>
    );
};

export default DataModal;