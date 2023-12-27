import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setEmployeeData, setData } from '../redux/actions';

const DetailedViewPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const selectedItem = useSelector((state) => state.data.find((item) => item.id === id));
  const employeeData = useSelector((state) => state.employeeData);

  useEffect(() => {
    fetch(`http://localhost:3001/api/data/${id}`)
      .then((response) => response.json())
      .then((data) => {
        dispatch(setData(data));

        const employeeIds = data?.employees || [];
        if (employeeIds.length > 0) {
          fetch('http://localhost:3001/api/employees')
            .then((response) => response.json())
            .then((employeeData) => {
              dispatch(setEmployeeData(employeeData));
            })
            .catch((error) => console.error('Error fetching employees:', error));
        }
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, [id, dispatch]);

  if (!selectedItem) {
    return <p className="data-not-found">Data not found.</p>;
  }

  return (
    <div className="detailed-view-page">
      <h1 className="data-title">{selectedItem.title}</h1>
      <p className="data-description">{selectedItem.description}</p>
      {employeeData.length > 0 && selectedItem.employees && (
        <div className="employee-list">
          <h2 className="employee-list-heading">Employees:</h2>
          <ul className="employee-list-items">
            {selectedItem.employees.map((employeeId) => {
              const employee = employeeData.find((e) => e.id === employeeId);
              return (
                <li key={employeeId} className="employee-list-item">
                  {employee ? employee.name : 'Unknown Employee'}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <Link to="/list" className="go-back-button">Go back to Data List</Link>
    </div>
  );
};

export default DetailedViewPage;
