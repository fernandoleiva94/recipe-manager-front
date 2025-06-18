// Axios.js (o donde configures axiosInstance)
import axios from 'axios';

const serviceUrl = process.env.REACT_APP_USER_MANAGER_URL;


const instance = axios.create({
  baseURL: serviceUrl, // Ajusta según tu API
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