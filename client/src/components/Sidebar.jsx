import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import API from '../api';
import '../index.css';

const Sidebar = ({ onFilterChange }) => {
  const [countries, setCountries] = useState([]);
  const [years, setYears] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // Show sidebar by default on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    handleResize();
  }, []);

  // Fetch country and year options
  useEffect(() => {
    API.get('/metadata')
      .then((res) => {
        const countryOptions = [{ value: 'All', label: 'All' }, ...res.data.countries.map(c => ({ value: c, label: c }))];
        const yearOptions = [{ value: 'All', label: 'All' }, ...res.data.years.map(y => ({ value: y, label: y }))];
        setCountries(countryOptions);
        setYears(yearOptions);
      })
      .catch((err) => {
        console.error('Failed to fetch metadata:', err);
      });
  }, []);

  // Notify parent of changes
  useEffect(() => {
    onFilterChange({
      country: selectedCountry?.value || 'All',
      year: selectedYear?.value || 'All',
    });
  }, [selectedCountry, selectedYear, onFilterChange]);

  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: '8px',
      padding: '2px 4px',
      backgroundColor: '#e6f0fa',
      borderColor: state.isFocused ? '#80bfff' : '#ccc',
      boxShadow: state.isFocused ? '0 0 0 2px #80bfff50' : 'none',
      '&:hover': {
        borderColor: '#80bfff',
      },
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '8px',
      backgroundColor: '#f0f8ff',
      zIndex: 9999,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? '#d0e8ff' : 'white',
      color: '#333',
      cursor: 'pointer',
      padding: '10px',
    }),
  };

  return (
    <>
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Close Filters' : 'Show Filters'}
      </button>

      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <h2>Filters</h2>

        <label htmlFor="country-select">Country</label>
        <Select
          id="country-select"
          options={countries}
          value={selectedCountry}
          onChange={setSelectedCountry}
          styles={customStyles}
          placeholder="Select Country"
          isSearchable={true}
        />

        <label htmlFor="year-select">Year</label>
        <Select
          id="year-select"
          options={years}
          value={selectedYear}
          onChange={setSelectedYear}
          styles={customStyles}
          placeholder="Select Year"
          isSearchable={false}
        />

        <button
          onClick={() => {
            setSelectedCountry(null);
            setSelectedYear(null);
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
