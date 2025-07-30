import React, { useEffect, useState, useRef } from 'react';
import API from '../api';
import './SummaryTable.css';
import { motion, useInView } from 'framer-motion';

function SummaryTable({ filters }) {
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(false);

  const ref = useRef(null);
  // triggers animation when near viewport
  const isInView = useInView(ref, { once: true, margin: '-100px' }); 

  useEffect(() => {
    if (!filters || !filters.country || filters.country === 'All') {
      setSummaryData([]);
      return;
    }

    setLoading(true);
    API.get('/data', {
      params: {
        country: filters.country,
        startYear: 2007,
        endYear: 2017,
      },
    })
      .then(res => {
        console.log("Summary API response:", res.data);
        setSummaryData(res.data);
      })
      .catch(err => {
        console.error('Error fetching summary data:', err);
        setSummaryData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filters.country]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="summary-table-container"
    >
      <h2>Country Summary (2007 - 2017)</h2>
      <table className="summary-table">
        <thead>
          <tr>
            <th>Country</th>
            <th>Year</th>
            <th>Malaria Cases</th>
            <th>Bed Net Usage (%)</th>
            <th>Safe Water Usage (%)</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="5">Loading...</td></tr>
          ) : Array.isArray(summaryData) && summaryData.length > 0 ? (
            summaryData.map((row, index) => (
              <tr key={index}>
                <td>{row["Country Name"]}</td>
                <td>{row["Year"]}</td>
                <td>{row["Malaria cases reported"]?.toLocaleString() || '0'}</td>
                <td>{row["Use of insecticide-treated bed nets (% of under-5 population)"] || 'N/A'}</td>
                <td>{row["People using safely managed drinking water services (% of population)"] || 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="5">No data available</td></tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
}

export default SummaryTable;
