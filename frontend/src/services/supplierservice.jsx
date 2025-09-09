
// supplierservice.jsx
import axios from "axios";

const API_URL = "http://localhost:3000/api/suppliers";

class SupplierService {
  getConfig() {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found! Please log in.");
    }
    return { headers: { Authorization: `Bearer ${token}` } };
  }

  saveSupplier(data) {
    return axios.post(`${API_URL}/add`, data, this.getConfig());
  }

  getSupplier() {
    return axios.get(`${API_URL}/view`, this.getConfig());
  }

  getSupplierById(id) {
    return axios.get(`${API_URL}/${id}`, this.getConfig());
  }

  updateSupplier(id, data) {
    return axios.put(`${API_URL}/update/${id}`, data, this.getConfig());
  }

  // Fix naming: must be delSupplier to match your component
  delSupplier(id) {
    return axios.delete(`${API_URL}/delete/${id}`, this.getConfig());
  }

  searchSupplier(name) {
    return axios.get(`${API_URL}/search/${name}`, this.getConfig());
  }
}

export default new SupplierService();
