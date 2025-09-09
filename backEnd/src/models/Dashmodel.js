let db = require("../../db.js");

// Total products count
exports.getTotalProducts = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT COUNT(*) AS total FROM product", (err, result) => {
      if (err) reject(err);
      else resolve(result[0].total);
    });
  });
};

// Category-wise product count
exports.getCategoryWiseCount = () => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT c.cname, COUNT(p.pid) AS count
       FROM category c
       LEFT JOIN product p ON c.cid = p.cid
       GROUP BY c.cname`,
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};

// Sales per product
exports.getSalesPerProduct = () => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT p.pname, SUM(si.qty) AS total_sold
       FROM sales_items si
       JOIN product p ON si.productId = p.pid
       GROUP BY si.productId, p.pname`,
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};
