import axios from 'axios';

const API = axios.create({
  baseURL: 'https://interactive-malaria-explorer-dashboard-1.onrender.com/',
});

export default API;
 