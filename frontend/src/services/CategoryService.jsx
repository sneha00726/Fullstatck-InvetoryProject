import axios from "axios";

// Helper to get JWT token from localStorage
const getToken = () => localStorage.getItem("token");

class CategoryService {
  getAuthHeaders() {
    return { headers: { Authorization: `Bearer ${getToken()}` } };
  }

  saveCategory(catdata) {
    return axios.post("http://localhost:3000/api/categories/add", catdata, this.getAuthHeaders());
  }

  getCategory() {
    return axios.get("http://localhost:3000/api/categories/view", this.getAuthHeaders());
  }

  delCat(catId) {
    return axios.delete(`http://localhost:3000/api/categories/delete/${catId}`, this.getAuthHeaders());
  }

  searchCategory(name) {
    return axios.get(`http://localhost:3000/api/categories/search/${name}`, this.getAuthHeaders());
  }

  updateCategory(catId, catData) {
    return axios.put(`http://localhost:3000/api/categories/update/${catId}`, catData, this.getAuthHeaders());
  }

  getCategoryById(catId) {
    return axios.get(`http://localhost:3000/api/categories/${catId}`, this.getAuthHeaders());
  }
}

export default new CategoryService();
