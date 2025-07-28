// components/MalariaTrendChart.jsx
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import API from '../api';

function LineChart() {
  const [lineData, setLineData] = useState([]);

  useEffect(() => {
    API.get('/malaria-trends')
      .then(res => setLineData(res.data))
      .catch(err => console.error('Trend data error:', err));
  }, []);

  return (
    <div className="chart-box">
      <h3>Malaria Incidence Trend Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={lineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="cases" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LineChart;