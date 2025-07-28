import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, Tooltip, Cell,
  CartesianGrid, ResponsiveContainer, Legend
} from 'recharts';
import API from '../api';
import './TopCountries.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28FD0', '#FF6666', '#33CC99', '#FFB6C1', '#FFD700', '#4B0082'];

const TopCountriesBarChart = ({ year }) => {
  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState('bar');

  useEffect(() => {
    if (!year) return;

    API.get('/top-countries', {
      params: { year },
    })
      .then((res) => setChartData(res.data))
      .catch((err) => console.error('Error fetching top countries:', err));
  }, [year]);

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">Top 10 Countries by Malaria Cases ({year})</h3>
        <select value={chartType} onChange={(e) => setChartType(e.target.value)} className="chart-select">
          <option value="bar">Bar Chart</option>
          <option value="pie">Pie Chart</option>
        </select>
      </div>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={500}>
          {chartType === 'bar' ? (
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="Country Name"
                angle={-45}
                textAnchor="end"
                interval={0}
                height={80}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="Malaria cases reported"
                fill="#377DF4"
                barSize={40}
              />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={chartData}
                dataKey="Malaria cases reported"
                nameKey="Country Name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="vertical" align="right" verticalAlign="middle" />
            </PieChart>
          )}
        </ResponsiveContainer>
      ) : (
        <p>No data available for this year.</p>
      )}
    </div>
  );
};

export default TopCountriesBarChart;
