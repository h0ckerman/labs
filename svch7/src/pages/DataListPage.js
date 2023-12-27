import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DataItem from './DataItem';
import DataModal from './DataModal';
import Button from '../components/button';
import '../css/DataListPage.css';
import { useDispatch, useSelector } from 'react-redux';

const DataListPage = () => {

  const dispatch = useDispatch();
  const data = useSelector((state) => state.data);

  useEffect(() => {
    fetch('http://localhost:3001/api/data')
      .then((response) => response.json())
      .then((jsonData) => {
        dispatch({ type: 'SET_DATA', payload: jsonData });
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, [dispatch]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

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
      const response = await fetch(`http://localhost:3001/api/data/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const updatedData = data.filter((item) => item.id !== id);
        dispatch({ type: 'SET_DATA', payload: updatedData });
      } else {
        console.error('Error deleting data:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting data:', error.message);
    }
  };

  return (
    <div className="data-list-container">
      <h1>Data List</h1>
      <Link to="/" className="link-to-welcome">Go to Welcome Page</Link>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            <DataItem
              item={item}
              openModal={openModal}
              handleDelete={handleDelete}
            />
          </li>
        ))}
      </ul>
      <Button onClick={() => openModal(null)} label="Add New"></Button>

      {modalOpen && (
        <DataModal
          isOpen={modalOpen}
          data={selectedData}
          onClose={closeModal}
          // setData={setData}
        />
      )}
    </div>


  );
};

export default DataListPage;
