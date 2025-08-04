import React, { useEffect, useState, useRef } from 'react';
import './SummaryTable.css';
import { motion, useInView } from 'framer-motion';

function SummaryTable({ filters }) {
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(false);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' }); 

  const selectedCountry = filters.country;
  const startYear = 2007;
  const endYear = 2017;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://interactive-malaria-explorer-dashboard-1.onrender.com/table?country=${selectedCountry}&startYear=${startYear}&endYear=${endYear}`);
        const data = await response.json();
        console.log("Fetched data:", data);

        if (!Array.isArray(data)) {
          console.error("Expected array but got:", typeof data);
          setSummaryData([]);
        } else {
          setSummaryData(data);
        }
      } catch (error) {
        console.error('Error fetching summary data:', error);
        setSummaryData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCountry, startYear, endYear]);

  const normalize = Array.isArray(summaryData)
    ? summaryData.map(row => ({
        country: row['Country Name'],
        year: row['Year'],
        cases: row['Malaria cases reported'],
        nest: row['Use of insecticide-treated bed nets (% of under-5 population'],
        water: row['People using safely managed drinking water services (% of population)'],
      }))
    : [];

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
          ) : normalize.length > 0 ? (
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
