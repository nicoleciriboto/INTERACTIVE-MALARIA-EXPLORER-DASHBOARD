import React, { useEffect, useState, useRef } from 'react';
import './SummaryTable.css';
import { motion, useInView } from 'framer-motion';
import html2canvas from 'html2canvas'

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
        let text = await response.text();

        text=text.replace(/\bNaN\b/g, 'null'); // Replace 'NaN' with 'null' for JSON parsing
        const data = JSON.parse(text);
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

  const handleExportImage = () => {
    const tableElement = ref.current;
    if (tableElement) {
      html2canvas(tableElement).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL();
        link.download = 'summary_table.png';
        link.click();
      });
    }
  };

  const normalize = Array.isArray(summaryData)
    ? summaryData.map(row => ({
        country: row['Country Name'],
        year: row['Year'],
        cases: row['Malaria cases reported'],
        urbanPopGrowth: typeof row['Urban population growth (annual %)'] === 'number'
        ? row['Urban population growth (annual %)']
        : (row['Urban population growth (annual %)'] ? Number(row['Urban population growth (annual %)']) : null),
         ruralPopPercent: typeof row['Rural population (% of total population)'] === 'number'
        ? row['Rural population (% of total population)']
        : (row['Rural population (% of total population)'] ? Number(row['Rural population (% of total population)']) : null),

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
      <button onClick={handleExportImage} className="export-button">
        Export as Image</button>
      <table className="summary-table">
        <thead>
          <tr>
            <th>Country</th>
            <th>Year</th>
            <th>Malaria Cases</th>
            <th>Urban Population (%)</th>
            <th>Rural Population (%)</th>
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
                <td>{row.urbanPopGrowth !== null && row.urbanPopGrowth !== undefined && row.urbanPopGrowth !== '' ? Number(row.urbanPopGrowth).toFixed(2) : 'N/A'}</td>
                <td>{row.ruralPopPercent !== null && row.ruralPopPercent !== undefined && row.ruralPopPercent !== '' ? Number(row.ruralPopPercent).toFixed(2) : 'N/A'}</td>
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
