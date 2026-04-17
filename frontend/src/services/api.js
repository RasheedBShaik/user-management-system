import axios from "axios";

const API = axios.create({
  // Ensure there is NO trailing slash after /api
  baseURL: "https://user-management-system-jm59.onrender.com/api", 
  // baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;