import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { setEmployeeData } from '../../redux/actions';

const EmployeeListPage = () => {

  const dispatch = useDispatch();
  const data = useSelector((state) => state.employeeData);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/employees');
      const jsonData = await response.json();
      dispatch(setEmployeeData(jsonData));
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error fetching data. Please try again later.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleEdit = (id, name) => {
    setEditId(id);
    setEditName(name);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editId) {
        const response = await fetch(`http://localhost:3001/editEmployee/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: editName }),
        });

        if (response.ok) {
          fetchData();
          setShowModal(false);
        } else {
          console.error('Error saving changes:', response.statusText);
        }
      } else {
        const response = await fetch('http://localhost:3001/addEmployee', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: editName }),
        });

        if (response.ok) {
          fetchData();
          setShowModal(false);
        } else {
          console.error('Error adding a new entry:', response.statusText);
          toast.error('Error adding a new entry. Please try again later.', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      }
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/deleteEmployee/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchData();
      } else {
        console.error('Error deleting:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const handleAdd = () => {
    setEditId(null);
    setEditName('');
    setShowModal(true);
  };

  return (
    <div>
      <Row>
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>
                    <Button variant="primary" onClick={() => handleEdit(item.id, item.name)}>
                      Edit
                    </Button>{' '}
                    <Button variant="danger" onClick={() => handleDelete(item.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col>
          <Button variant="success" onClick={handleAdd}>
            Add Employee
          </Button>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Edit' : 'Add'} Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default EmployeeListPage;
