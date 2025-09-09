import axios from "axios";
//axios means HTTp client.on API psot /get use for perform 
const API_URL = "http://localhost:3000/api";//base url 

// Register new user (Promise style)
export const registerUser = (userData) => {
  return axios
    .post(`${API_URL}/register`, userData)
    .then((res) => res.data)
    .catch((err) => {
     
      throw (err.response && err.response.data) ? err.response.data : err;
    });
};

// Login user
export const loginUser = (credentials) => {
  return axios
    .post(`${API_URL}/login`, credentials)
    .then((res) => {
      // Save token if backend returned one
      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      return res.data;
    })
    .catch((err) => {
      throw (err.response && err.response.data) ? err.response.data : err;
    });
};

// Get current user info from token
export const getCurrentUser = () => {
  const token = localStorage.getItem("token");  //fetch token
  if (!token) return null;   //if not found return null
  try {
    // JWT payload is the middle part (base64)
    const payload = JSON.parse(atob(token.split(".")[1]));   
    return payload; // typically { id, role, iat, exp, ... }
  } catch (e) {
    // invalid token format
    return null;
  }
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem("token");
};
