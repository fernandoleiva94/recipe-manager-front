// Axios.js
import axios from 'axios';

const serviceUrl = process.env.REACT_APP_AUTH_SERVICE_URL;



const instance = axios.create({
  baseURL: serviceUrl, 
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;