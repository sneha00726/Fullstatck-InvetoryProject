import axios from "axios";

const API_BASE = "http://localhost:3000/api/dashboard";

export const getDashboardData = async () => {
  const [totalProducts, totalCategories, productsPerCategory, salesThisMonth, monthlySales] =
    await Promise.all([
      axios.get(`${API_BASE}/total-products`),
      axios.get(`${API_BASE}/total-categories`),
      axios.get(`${API_BASE}/products-per-category`),
      axios.get(`${API_BASE}/sales-this-month`),
      axios.get(`${API_BASE}/monthly-sales`),
    ]);

  return {
    totalProducts: totalProducts.data.totalProducts,
    totalCategories: totalCategories.data.totalCategories,
    productsPerCategory: productsPerCategory.data,
    salesThisMonth: salesThisMonth.data.totalSales || 0,
    monthlySales: monthlySales.data || [],
  };
};
