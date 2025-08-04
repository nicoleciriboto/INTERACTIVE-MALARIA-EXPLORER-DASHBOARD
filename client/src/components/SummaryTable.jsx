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
    // if (!filters || !filters.country || filters.country === 'All') {
    //   setSummaryData([]);
    //   return;
    // }

    setLoading(true);
    API.get('/table', {
      params: {
        country: filters.country,
        startYear: 2007,
        endYear: 2017,
      },
    })
      .then(res => {
        console.log("Summary API response:", res.data);
        console.log('Typeofres:', typeof res.data);
        console.log('isAnArray:', Array.isArray(res.data));

        let dataset = []
        if (typeof res.data === 'string') {
          const cleanedString = res.dataset.replace(/:\s*NaN/g,': null')
          dataset = JSON.parse(cleanedString);
          console.log('Dataset:', dataset)
        } else {
          dataset = res.data;
        }
        setSummaryData(dataset);
      })
      .catch(err => {
        console.error('Error fetching summary data:', err);
        setSummaryData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filters.country]);
  // console.log('Summary data:', summaryData);
  // console.log('Summary data length:', summaryData.length);

  const normalize = Array.isArray(summaryData) ? summaryData.map(row => ({
    country: row['Country Name'],
    year: row['Year'],
    cases: row['Malaria cases reported'],
    nest: row['Use of insecticide-treated bed nets (% of under-5 population'],
    water: row['People using safely managed drinking water services (% of population)'],
  })) : [];

  

  console.log('Normalize:', normalize)

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
          ) : summaryData &&  
          summaryData.length > 0 ? (
            normalize.map((row, index) => (
              <tr key={index}>
                <td>{row.country}</td>
                <td>{row.year}</td>
                <td>{row.cases?.toLocaleString() || '0'}</td>
                <td>{row.nest || 'N/A'}</td>
                <td>{row.water || 'N/A'}</td>
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
