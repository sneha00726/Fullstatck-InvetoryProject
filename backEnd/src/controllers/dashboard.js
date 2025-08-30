/*let DashboardModel=require("../models/dashboardmodel.js");

// Total products
exports.totalProducts = async (req, res) => {
  try {
    const total = await DashboardModel.getTotalProducts();
    res.status(200).json({ totalProducts: total });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch total products", error: err.message });
  }
};

exports.totalCategories = async (req, res) => {
  try {
    const total = await DashboardModel.getTotalCategories();
    res.status(200).json({ totalCategories: total });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch total categories", error: err.message });
  }
};

exports.productsPerCategory = async (req, res) => {
  try {
    const data = await DashboardModel.getProductsPerCategory();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products per category", error: err.message });
  }
};

exports.salesThisMonth = async (req, res) => {
  try {
    const data = await DashboardModel.getSalesThisMonth();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch sales this month", error: err.message });
  }
};

exports.monthlySales = async (req, res) => {
  try {
    const data = await DashboardModel.getMonthlySales();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch monthly sales", error: err.message });
  }
};*/