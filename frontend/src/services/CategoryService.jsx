import axios from 'axios';

const getToken = () => localStorage.getItem("token"); // JWT stored in localStorage

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
    return axios.delete(`http://localhost:3000/api/category/delete/${catId}`, this.getAuthHeaders());
  }

  searchCategory(name) {
    return axios.get(`http://localhost:3000/api/category/search/${name}`, this.getAuthHeaders());
  }

  updateCategory(catId, catData) {
    return axios.put(`http://localhost:3000/api/category/update/${catId}`, catData, this.getAuthHeaders());
  }
}

export default new CategoryService();
