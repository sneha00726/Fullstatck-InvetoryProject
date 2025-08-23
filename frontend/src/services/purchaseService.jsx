import axios from "axios";

const API_URL = "http://localhost:3000/api/purchases";
const getToken = () => localStorage.getItem("token");

class PurchaseService {
  getAuthHeaders() {
    return { headers: { Authorization: `Bearer ${getToken()}` } };
  }

  // Add a new purchase
  addPurchase(purchaseData) {
    return axios.post(`${API_URL}/add`, purchaseData, this.getAuthHeaders());
  }

  // Get all purchases
  viewPurchases() {
    return axios.get(`${API_URL}/view`, this.getAuthHeaders());
  }

  // Get purchase by ID
  getPurchaseById(id) {
    return axios.get(`${API_URL}/${id}`, this.getAuthHeaders());
  }

  // Update purchase by ID
  updatePurchase(id, purchaseData) {
    return axios.put(`${API_URL}/update/${id}`, purchaseData, this.getAuthHeaders());
  }

  // Delete purchase by ID
  deletePurchase(id) {
    return axios.delete(`${API_URL}/delete/${id}`, this.getAuthHeaders());
  }

  // Search purchase by name/product
  searchPurchase(name) {
    return axios.get(`${API_URL}/search/${name}`, this.getAuthHeaders());
  }
}

export default new PurchaseService();
