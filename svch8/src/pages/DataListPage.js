import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DataItem from './DataItem';
import DataModal from './DataModal';
import Button from '../components/button';
import '../css/DataListPage.css';

const DataListPage = ({ data, setData }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [postData, setPostData] = useState(null);

  useEffect(() => {
    // Fetch post data when the component mounts
    fetchPostData();
  }, []);

  const fetchPostData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/postData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const postData = await response.json();
        setPostData(postData);
      } else {
        console.error('Error fetching post data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching post data:', error.message);
    }
  };

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
        setData(updatedData);
        setPostData(updatedData)
      } else {
        console.error('Error deleting data:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting data:', error.message);
    }
  };

  const downloadFile = (content, fileName, contentType) => {
    const blob = new Blob([content], { type: contentType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  const downloadJSON = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/formattedData', {
        headers: {
          Accept: 'application/json',
        },
      });
      const jsonData = await response.json();
      downloadFile(JSON.stringify(jsonData, null, 2), 'data.json', 'application/json');
    } catch (error) {
      console.error('Error downloading JSON:', error.message);
    }
  };

  const downloadXML = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/formattedData', {
        headers: {
          Accept: 'application/xml',
        },
      });
      const xmlData = await response.text();
      downloadFile(xmlData, 'data.xml', 'application/xml');
    } catch (error) {
      console.error('Error downloading XML:', error.message);
    }
  };

  const downloadHTML = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/formattedData', {
        headers: {
          Accept: 'text/html',
        },
      });
      const htmlData = await response.text();
      downloadFile(htmlData, 'data.html', 'text/html');
    } catch (error) {
      console.error('Error downloading HTML:', error.message);
    }
  };

  return (
    <div className="data-list-container">
      <h1>Data List</h1>
      <Link to="/" className="link-to-welcome">
        Go to Welcome Page
      </Link>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            <DataItem item={item} openModal={openModal} handleDelete={handleDelete} />
          </li>
        ))}
      </ul>
      <Button onClick={() => openModal(null)} label="Add New"></Button>
      <br />
      <Button onClick={downloadJSON} label="Download JSON"></Button>
      <br />
      <Button onClick={downloadXML} label="Download XML"></Button>
      <br />
      <Button onClick={downloadHTML} label="Download HTML"></Button>

      {postData && (
        <div className="post-data-container">
          <h2>Post Data</h2>
          <ul>
            {postData.map((item) => (
              <li key={item.id}>
                <DataItem item={item} openModal={openModal} handleDelete={handleDelete} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {modalOpen && (
        <DataModal isOpen={modalOpen} data={selectedData} onClose={closeModal} setData={setData} setPostData={setPostData} />
      )}
    </div>
  );
};

export default DataListPage;
