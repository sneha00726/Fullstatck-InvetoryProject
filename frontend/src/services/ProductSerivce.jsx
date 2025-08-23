import axios from "axios";

// Helper to get JWT token from localStorage
const getToken = () => localStorage.getItem("token");

class ProductService {
  // Headers with token
  getAuthHeaders() {
    return { headers: { Authorization: `Bearer ${getToken()}` } };
  }

  // Create product (Admin only)
  saveProduct(prodData) {
    return axios.post(
      "http://localhost:3000/api/products/add",
      prodData,
      this.getAuthHeaders()
    );
  }

  // Read all products (Admin & User)
  getAllProducts() {
    return axios.get(
      "http://localhost:3000/api/products/view",
      this.getAuthHeaders()
    );
  }

  // Delete product (Admin only)
  delProd(prodId) {
    return axios.delete(
      `http://localhost:3000/api/products/delete/${prodId}`,
      this.getAuthHeaders()
    );
  }

  // Update product (Admin only)
  updateProduct(prodId, prodData) {
    return axios.put(
      `http://localhost:3000/api/products/update/${prodId}`,
      prodData,
      this.getAuthHeaders()
    );
  }

  // Search products (Admin & User)
  searchProduct(pname) {
    return axios.get(
      `http://localhost:3000/api/products/search/${pname}`,
      this.getAuthHeaders()
    );
  }
}

export default new ProductService();
import * as jwt_decode from "jwt-decode";

export const getCurrentUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwt_decode(token); // decode JWT payload
    return { id: decoded.id, role: decoded.role }; // return user info
  } catch (err) {
    console.error("Invalid token");
    return null;
  }
};