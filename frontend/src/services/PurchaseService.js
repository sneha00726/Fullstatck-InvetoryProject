import axios from "axios";

// Helper to get JWT token from localStorage
const getToken = () => localStorage.getItem("token");

class PurchaseService {
  // Headers with token
  getAuthHeaders() {
    return { headers: { Authorization: `Bearer ${getToken()}` } };
  }

  // Create Purchase (Admin only)
  addPurchase(purchaseData) {
    return axios.post(
      "http://localhost:3000/api/purchases/add",
      purchaseData,
      this.getAuthHeaders()
    );
  }

  // Read all Purchases (Admin only)
  getAllPurchases() {
    return axios.get(
      "http://localhost:3000/api/purchases/view",
      this.getAuthHeaders()
    );
  }

  // Get purchase by ID (Admin only)
  getPurchaseById(id) {
    return axios.get(
      `http://localhost:3000/api/purchases/${id}`,
      this.getAuthHeaders()
    );
  }

  // Update purchase (Admin only)
  updatePurchase(purchaseId, purchaseData) {
    return axios.put(
      `http://localhost:3000/api/purchases/update/${purchaseId}`,
      purchaseData,
      this.getAuthHeaders()
    );
  }

  // Delete purchase (Admin only)
  deletePurchase(purchaseId) {
    return axios.delete(
      `http://localhost:3000/api/purchases/delete/${purchaseId}`,
      this.getAuthHeaders()
    );
  }

  // Search purchases (Admin only)
  searchPurchase(name) {
    return axios.get(
      `http://localhost:3000/api/purchases/search/${name}`,
      this.getAuthHeaders()
    );
  }
}

export default new PurchaseService();
