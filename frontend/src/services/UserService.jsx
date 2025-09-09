import axios from "axios";

const API_URL = "http://localhost:3000/api/users"; // update as per your backend
const getToken = () => localStorage.getItem("token");

class UserService {
  getAuthHeaders() {
    return { headers: { Authorization: `Bearer ${getToken()}` } };
  }

  addUser(userData) {
    return axios.post(`${API_URL}/add`, userData, this.getAuthHeaders());
  }

  getAllUsers() {
    return axios.get(`${API_URL}/view`, this.getAuthHeaders());
  }

  
  updateUser(id, userData) {
    return axios.put(`${API_URL}/update/${id}`, userData, this.getAuthHeaders());
  }

  deleteUser(id) {
    return axios.delete(`${API_URL}/delete/${id}`, this.getAuthHeaders());
  }

  searchUsers(keyword) {
    return axios.get(`${API_URL}/search/${keyword}`, this.getAuthHeaders());
  }
}

export default new UserService();
