import axios from "axios";

class PurchaseService {
  addPurchase(data) {
    return axios.post("http://localhost:3000/api/purchases/add", data);
  }

  viewPurchases() {
    return axios.get("http://localhost:3000/api/purchases/view");
  }

  getPurchaseById(id) {
    return axios.get(`http://localhost:3000/api/purchases/${id}`);
  }

  updatePurchase(id, data) {
    return axios.put(`http://localhost:3000/api/purchases/update/${id}`, data);
  }

  deletePurchase(id) {
    return axios.delete(`http://localhost:3000/api/purchases/delete/${id}`);
  }
}

export default new PurchaseService();
