import React, { useEffect, useState } from 'react';
import API from '../api';
import { FaHeartbeat, FaStethoscope, FaToilet, FaTint } from 'react-icons/fa';
import {motion } from 'framer-motion';
import {fadeIn} from '../variants';
import '../index.css';

const Summary = ({ country, year }) => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (!country && !year) return;
    
    API.get('/summary', {
      params: { country, year },
    })
      .then(res => setSummary(res.data))
      .catch(err => console.error('Error fetching summary:', err));
  }, [country, year]);

  if (!summary) return <p>Loading summary...</p>;

return (
  <motion.div 
  className="summary-cards"
  variants={fadeIn('up', 0.2)}
  initial="hidden"
  whileInView={'show'}
  viewport={{ once: false, amount: 0.7 }}
  >
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card card-cases">
      <FaHeartbeat size={32} color="#fff" />
      <div>
        <h4>Total Malaria Cases</h4>
        <p>{summary["Total Cases"].toLocaleString()}</p>
      </div>
    </motion.div>

    <motion.div 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card card-incidence">
      <FaStethoscope size={32} color="#fff" />
      <div>
        <h4>Total Incidence</h4>
        <p>{summary["Total Incidences"].toLocaleString()} per 1000</p>
      </div>
    </motion.div>

      <motion.div

      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card card-sanitation">
      <FaTint size={32} color="#fff" />
      <div>
        <h4>% Using Safe Sanitation</h4>
        <p>{summary["Total % using safe sanitation services"].toFixed(2)}%</p>
      </div>
    </motion.div>
  </motion.div>
);
};

export default Summary;
