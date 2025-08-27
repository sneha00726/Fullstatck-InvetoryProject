import axios from "axios";

// Helper to get JWT token from localStorage
let getToken = () => localStorage.getItem("token");

class PurchaseService {
  // Headers with token
  getAuthHeaders() {
    return { headers: { Authorization: `Bearer ${getToken()}` } };
  }

  // Add Purchase
  addPurchase(purchaseData) {
    return axios.post(
      "http://localhost:3000/api/purchases/add",
      purchaseData,
      this.getAuthHeaders()
    );
  }

  // Get all Purchases (with pagination)
  getAllPurchases(page = 1, limit = 5) {
    return axios.get(
      `http://localhost:3000/api/purchases/view?page=${page}&limit=${limit}`,
      this.getAuthHeaders()
    );
  }

  // Get single purchase by ID
  getPurchaseById(purchaseId) {
    return axios.get(
      `http://localhost:3000/api/purchases/${purchaseId}`,
      this.getAuthHeaders()
    );
  }

  // Update purchase
  updatePurchase(purchaseId, purchaseData) {
    return axios.put(
      `http://localhost:3000/api/purchases/update/${purchaseId}`,
      purchaseData,
      this.getAuthHeaders()
    );
  }

  // Delete purchase
  deletePurchase(purchaseId) {
    return axios.delete(
      `http://localhost:3000/api/purchases/delete/${purchaseId}`,
      this.getAuthHeaders()
    );
  }

  // Search purchase by supplier name
  searchPurchase(supplierName) {
    return axios.get(
      `http://localhost:3000/api/purchases/search/${supplierName}`,
      this.getAuthHeaders()
    );
  }
}

export default new PurchaseService();
