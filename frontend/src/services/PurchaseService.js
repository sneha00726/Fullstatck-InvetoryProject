import axios from "axios";

// Helper to get JWT token from localStorage
const getToken = () => localStorage.getItem("token");

class PurchaseService 
{
  // Headers with token
  getAuthHeaders() {
    return { headers: { Authorization: `Bearer ${getToken()}` } };
  }

  // Create purchase (Admin only)
  addPurchase(purchaseData) 
  {
    return axios.post(
      "http://localhost:3000/api/purchases/add",
      purchaseData,
      this.getAuthHeaders()
    );
  }

  // Read all purchases (Admin & User)
  getAllPurchases() {
    return axios.get(
      "http://localhost:3000/api/purchases/view",
      this.getAuthHeaders()
    );
  }

  // Get purchase by ID
  getPurchaseById(purchaseId) {
    return axios.get(
      `http://localhost:3000/api/purchases/${purchaseId}`,
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

  // Search purchases (by invoice/supplier etc.)
  searchPurchase(keyword) {
    return axios.get(
      `http://localhost:3000/api/purchases/search/${keyword}`,
      this.getAuthHeaders()
    );
  }
}

export default new PurchaseService();
