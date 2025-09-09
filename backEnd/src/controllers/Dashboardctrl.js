const dashModel = require("../models/DashModel.js");

// Total products
exports.getTotalProducts = (req, res) => {
  dashModel.getTotalProducts()
    .then(totalProducts => {
      res.status(200).json({ success: true, totalProducts });
    })
    .catch(err => {
      res.status(500).json({ success: false, message: "Failed to fetch total products", error: err.message });
    });
};

// Category-wise count
exports.getCategoryWiseCount = (req, res) => {
  dashModel.getCategoryWiseCount()
    .then(categoryWise => {
      res.status(200).json({ success: true, categoryWise });
    })
    .catch(err => {
      res.status(500).json({ success: false, message: "Failed to fetch category count", error: err.message });
    });
};

// Sales per product
exports.getSalesPerProduct = (req, res) => {
  dashModel.getSalesPerProduct()
    .then(salesPerProduct => {
      res.status(200).json({ success: true, salesPerProduct });
    })
    .catch(err => {
      res.status(500).json({ success: false, message: "Failed to fetch sales per product", error: err.message });
    });
};
