import React, { useEffect, useState } from 'react';
import API from '../api';
import { FaHeartbeat, FaStethoscope, FaToilet, FaTint } from 'react-icons/fa';
import '../index.css';

const Summary = ({ country, year }) => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (!country && !year) return;
    
    API.get('/summary', {
      params: { country, year },
    })
      .then(res => setSummary(res.data))
      .catch(err => console.error('Error fetching summary:', err));
  }, [country, year]);

  if (!summary) return <p>Loading summary...</p>;

return (
  <div className="summary-cards">
    <div className="card card-cases">
      <FaHeartbeat size={32} color="#fff" />
      <div>
        <h4>Total Malaria Cases</h4>
        <p>{summary["Total Cases"].toLocaleString()}</p>
      </div>
    </div>

    <div className="card card-incidence">
      <FaStethoscope size={32} color="#fff" />
      <div>
        <h4>Total Incidence</h4>
        <p>{summary["Total Incidences"].toLocaleString()} per 1000</p>
      </div>
    </div>

      <div className="card card-sanitation">
      <FaTint size={32} color="#fff" />
      <div>
        <h4>% Using Safe Sanitation</h4>
        <p>{summary["Total % using safe sanitation services"].toFixed(2)}%</p>
      </div>
    </div>
  </div>
);
};

export default Summary;
