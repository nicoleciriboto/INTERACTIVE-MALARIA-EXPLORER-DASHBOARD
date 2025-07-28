// components/ChartsSection.jsx
import React from 'react';
import TopCountriesBar from './components/TopCountriesBar';
import LineChart from './components/LineChart';
import './ChartSection.css';

function ChartSection({ year }) {
  return (
    <div className="charts-row">
      <TopCountriesBar year={year} />
      <LineChart year={year}/>
    </div>
  );
}

export default ChartSection;
