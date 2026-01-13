import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://127.0.0.1:8001', // For Local deployment
  baseURL: 'https://mams-backend-xyz.onrender.com',
});

export default api;
