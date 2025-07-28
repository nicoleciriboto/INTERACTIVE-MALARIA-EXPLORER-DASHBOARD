import React, { useState, useEffect } from 'react';
import API from './api';
import Sidebar from './components/Sidebar';
import Summary from './components/Summary';
import TopCountriesBar from './components/TopCountriesBar'; 
import ChoroplethMap from './components/ChoroplethMap';  
import SummaryTable from './components/SummaryTable';

function App() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({ country: '', year: '' });

  useEffect(() => {
    API.get('/data', {
      params: {
        country: filters.country,
        year: filters.year,
      },
    })
      .then(res => setData(res.data))
      .catch(err => console.error('Error fetching data:', err));
  }, [filters]);

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar onFilterChange={setFilters} />
      <div style={{ flexGrow: 1, padding: '20px' }}>
        <h1>Interactive Malaria Explorer Dashboard</h1>
        <p className='app-p'>Analyzing malaria cases and incidences across African countries (2007-2017)</p>
        <Summary country={filters.country} year={filters.year} /> 
        <TopCountriesBar year={filters.year} />
        <ChoroplethMap year={filters.year} />
        <SummaryTable filters={filters} />

      </div>
    </div>
  );
}

export default App;