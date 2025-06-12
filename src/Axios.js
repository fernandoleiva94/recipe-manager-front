// Axios.js (o donde configures axiosInstance)
import axios from 'axios';


const instance = axios.create({
  baseURL: "http://localhost:8080", // Ajusta según tu API
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