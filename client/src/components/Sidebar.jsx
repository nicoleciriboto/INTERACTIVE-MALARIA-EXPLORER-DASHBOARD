import React, { useState, useEffect } from 'react';
import API from '../api';
import '../index.css';

const Sidebar = ({ onFilterChange }) => {
  const [countries, setCountries] = useState([]);
  const [years, setYears] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [isOpen, setIsOpen] = useState(true); // Toggle sidebar

  useEffect(() => {
    API.get('/metadata')
      .then((res) => {
        setCountries(res.data.countries || []);
        setYears(res.data.years || []);
      })
      .catch((err) => {
        console.error('Failed to fetch metadata:', err);
      });
  }, []);

  useEffect(() => {
    onFilterChange({ country: selectedCountry, year: selectedYear });
  }, [selectedCountry, selectedYear, onFilterChange]);

  return (
    <>
      {/* Toggle button for small screens */}
      <button
        className="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? 'Close Filters' : 'Show Filters'}
      </button>

      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <h2>Filters</h2>

        <label htmlFor="country-select">Country</label>
        <select
          id="country-select"
          className="custom-select"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label htmlFor="year-select">Year</label>
        <select
          id="year-select"
          className="custom-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setSelectedCountry('All');
            setSelectedYear('All');
          }}
          className="reset-button"
        >
          Reset Filters
        </button>
      </div>
    </>
  );
};

export default Sidebar;
