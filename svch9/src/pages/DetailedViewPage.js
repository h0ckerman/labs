import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'; // Import axios

import { setData } from '../redux/actions';

const DetailedViewPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const selectedItem = useSelector((state) => state.data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const visitResponse = await axios.get(`http://localhost:3001/visits/${id}`);
        const data = visitResponse.data;
        dispatch(setData(data));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id, dispatch]);

  if (!selectedItem) {
    return <p className="data-not-found">Data not found.</p>;
  }

  return (
    <div className="detailed-view-page">
      <h1 className="data-title">{selectedItem.title}</h1>
      <p className="data-description">{selectedItem.description}</p>
      {selectedItem.Employees && selectedItem.Employees.length > 0 && (
        <div className="employee-list">
          <h2 className="employee-list-heading">Employees:</h2>
          <ul className="employee-list-items">
            {selectedItem.Employees.map((employee) => (
              <li key={employee.id} className="employee-list-item">
                {employee.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link to="/list" className="go-back-button">
        Go back to Data List
      </Link>
    </div>
  );
};

export default DetailedViewPage;
