// services/SaleService.js
import axios from "axios";

const API_URL = "http://localhost:3000/api/sales";

const addSale = (saleData, token) => {
  return axios.post(`${API_URL}/add`, saleData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

const getAllSales = (token) => {
  return axios.get(`${API_URL}/view`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

const getSaleById = (id, token) => {
  return axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export default {
  addSale,
  getAllSales,
  getSaleById
};
