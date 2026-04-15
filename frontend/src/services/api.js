import axios from "axios";

const API = axios.create({
  // Use localhost if your server says 'localhost'
  baseURL: "http://localhost:5000/api", 
  // timeout: 5000, 
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    // Ensure this key matches what you set during Login
    const token = localStorage.getItem("token"); 
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;