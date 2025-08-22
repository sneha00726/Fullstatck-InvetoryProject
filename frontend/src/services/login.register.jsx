import axios from "axios";

const API_URL = "http://localhost:3000/api";

// Register new user
export const registerUser = async (userData) => {
  try {
    const res = await axios.post(`${API_URL}/register`, userData);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const loginUser = async (credentials) => {
  try {
    const res = await axios.post(`${API_URL}/login`, credentials);
    // save token to localStorage
    if (res.data.token) localStorage.setItem("token", res.data.token);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Get current user info from token
export const getCurrentUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  // Decode token payload (simple base64 decode)
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload; // { id, role }
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem("token");
};