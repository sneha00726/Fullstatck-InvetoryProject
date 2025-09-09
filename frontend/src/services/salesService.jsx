import axios from "axios";

const API_URL = "http://localhost:3000/api/sales";
const getToken = () => localStorage.getItem("token");

class SaleService {
  getAuthHeaders() {
    return { headers: { Authorization: `Bearer ${getToken()}` } };
  }

  addSale(saleData) {
    return axios.post(`${API_URL}/add`, saleData, this.getAuthHeaders());
  }

  getAllSales() {
    return axios.get(`${API_URL}/view`, this.getAuthHeaders());
  }

  getSaleById(id) {
    return axios.get(`${API_URL}/${id}`, this.getAuthHeaders());
  }

  updateSale(id, saleData) {
    return axios.put(`${API_URL}/update/${id}`, saleData, this.getAuthHeaders());
  }

  deleteSale(id) {
    return axios.delete(`${API_URL}/delete/${id}`, this.getAuthHeaders());
  }

  searchSale(name) {
    return axios.get(`${API_URL}/search/${name}`, this.getAuthHeaders());
  }
   downloadInvoice(id) {
  return axios.get(`${API_URL}/download/${id}`, {
    ...this.getAuthHeaders(),
    responseType: "blob", //  important for file download
  });
}
}

export default new SaleService();
