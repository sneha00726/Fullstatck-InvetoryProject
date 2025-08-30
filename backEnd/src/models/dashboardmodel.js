/*let db = require("../../db.js");

module.exports = {
  getTotalProducts: () => {
    return new Promise((resolve, reject) => {
      db.query("SELECT COUNT(*) AS totalProducts FROM product WHERE status='active'", (err, results) => {
        if (err) reject(err);
        else resolve(results[0].totalProducts);
      });
    });
  },

  getTotalCategories: () => {
    return new Promise((resolve, reject) => {
      db.query("SELECT COUNT(*) AS totalCategories FROM category WHERE status='active'", (err, results) => {
        if (err) reject(err);
        else resolve(results[0].totalCategories);
      });
    });
  },

  getProductsPerCategory: () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT c.cname, COUNT(p.pid) AS productCount
        FROM category c
        LEFT JOIN product p ON c.cid = p.cid AND p.status='active'
        WHERE c.status='active'
        GROUP BY c.cid
      `;
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  getSalesThisMonth: () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT COUNT(*) AS totalSales, SUM(total_amount) AS totalRevenue
        FROM sales
        WHERE MONTH(sale_date) = MONTH(CURRENT_DATE())
          AND YEAR(sale_date) = YEAR(CURRENT_DATE())
      `;
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  },

  getMonthlySales: () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT MONTH(sale_date) AS month, SUM(total_amount) AS revenue
        FROM sales
        WHERE YEAR(sale_date) = YEAR(CURRENT_DATE())
        GROUP BY MONTH(sale_date)
      `;
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },
};*/