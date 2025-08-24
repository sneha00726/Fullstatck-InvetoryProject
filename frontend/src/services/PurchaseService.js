import axios from "axios";
class PurchaseService {

  // Add Purchase
  addPurchase(purchaseData) {
    return axios.post(
      "http://localhost:3000/api/purchases/add",
      purchaseData,
      this.getAuthHeaders()
    );
  }

  // Get all Purchases
  getAllPurchases() {
    return axios.get(
      "http://localhost:3000/api/purchases/view",
      this.getAuthHeaders()
    );
  }

  // Get Purchase by ID
  getPurchaseById(id) {
    return axios.get(
      `http://localhost:3000/api/purchases/${id}`,
      this.getAuthHeaders()
    );
  }

  // Update Purchase
  updatePurchase(id, purchaseData) {
    return axios.put(
      `http://localhost:3000/api/purchases/update/${id}`,
      purchaseData,
      this.getAuthHeaders()
    );
  }

  // Delete Purchase
  deletePurchase(id) {
    return axios.delete(
      `http://localhost:3000/api/purchases/delete/${id}`,
      this.getAuthHeaders()
    );
  }

  // Search Purchase
  searchPurchase(name) {
    return axios.get(
      `http://localhost:3000/api/purchases/search/${name}`,
      this.getAuthHeaders()
    );
  }
}

export default new PurchaseService();
