import axios from "axios";

// Axios instance
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add token if using auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // if JWT used
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
