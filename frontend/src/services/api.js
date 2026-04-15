import axios from "axios";

const API = axios.create({
  // REPLACE THE LINK BELOW WITH YOUR ACTUAL RENDER URL
  baseURL: "https://user-management-system-backend-xxxx.onrender.com/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default API;