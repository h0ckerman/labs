// DataItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/button';
import '../css/DataItem.css';

const DataItem = ({ item, openModal, handleDelete }) => (
    <div className="data-item-container">
      <div className="data-item" key={item.id}>
        <Link to={`/details/${item.id}`} className="data-link">
          {item.title}
        </Link>
      </div>
      <div className="button-container">
        <Button onClick={() => openModal(item)} label="Edit" />
        <Button onClick={() => handleDelete(item.id)} label="Delete" />
      </div>
    </div>
  );
  
  export default DataItem;
