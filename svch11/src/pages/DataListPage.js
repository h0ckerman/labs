import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, ListGroup, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import jsPDF from 'jspdf';

import DataItem from './DataItem';
import DataModal from './DataModal';

import { Audio } from 'react-loader-spinner';

const DataListPage = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('User not authenticated');
          return;
        }

        const response = await axios.get('http://localhost:3001/visits', {
          headers: {
            Authorization: `${token}`,
          },
        });

        dispatch({ type: 'SET_DATA', payload: response.data });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false)
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

  const generatePDF = (data) => {
    const pdf = new jsPDF();
    pdf.text('Visits Report', 20, 20);

    data.forEach((visits, index) => {
      const startY = 30 + index * 40;
      pdf.text(`Title: ${visits.title}`, 20, startY + 10);
      pdf.text(`Description: ${visits.description}`, 20, startY + 20);
      pdf.text(`Created At: ${visits.createdAt}`, 20, startY + 30);
      pdf.text(`Updated At: ${visits.updatedAt}`, 20, startY + 40);
      pdf.line(20, startY + 45, 190, startY + 45);
    });

    pdf.save('visits_report.pdf');
  };

  return (
    <div className="data-list-container">
      {loading ? (
        <Audio
          height="80"
          width="80"
          radius="9"
          color="green"
          ariaLabel="loading"
          wrapperStyle
          wrapperClass
        />
      ) : (
        <>
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

          <Button variant="primary" onClick={() => generatePDF(data)}>
            Generate Report
          </Button>

          <DataModal isOpen={modalOpen} data={selectedData} onClose={closeModal} setData={setSelectedData} />
        </>
      )}
    </div>
  );
};

export default DataListPage;
