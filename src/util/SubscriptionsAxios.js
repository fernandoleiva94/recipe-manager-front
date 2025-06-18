// Axios.js (o donde configures axiosInstance)
import axios from 'axios';
const apiUrl = process.env.REACT_APP_SUBSCRIPTION_MANAGER_API_URL;

const instance = axios.create({
  baseURL: apiUrl, // Ajusta según tu API
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