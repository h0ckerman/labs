import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, ListGroup, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import DataItem from './DataItem';
import DataModal from './DataModal';

const DataListPage = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/visits');
        dispatch({ type: 'SET_DATA', payload: response.data });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [dispatch, modalOpen]);


  const openModal = (data) => {
    setSelectedData(data);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedData(null);
    setModalOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3001/visits/${id}`);

      if (response.status === 200) {
        const updatedData = data.filter((item) => item.id !== id);
        dispatch({ type: 'SET_DATA', payload: updatedData });
      } else {
        console.error('Error deleting data:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting data:', error.message);
    }
  };

  if (!Array.isArray(data)) {
    return <p>Loading or error handling...</p>;
  }

  return (
    <div className="data-list-container">
      <h1>Data List</h1>
      <Link to="/" className="link-to-welcome">
        Go to Welcome Page
      </Link>
      <ListGroup>
        {data.map((item) => (
          <ListGroup.Item key={item.id}>
            <DataItem
              item={item}
              openModal={openModal}
              handleDelete={handleDelete}
            />
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Button variant="primary" onClick={() => openModal(null)}>
        Add New
      </Button>

      <DataModal isOpen={modalOpen} data={selectedData} onClose={closeModal} setData={setSelectedData} />
    </div>
  );
};

export default DataListPage;
