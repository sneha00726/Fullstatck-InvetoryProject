let db = require("../../db.js");

// Add category (with duplicate check)
exports.CreateCategoryAdd = (name) => {
    return new Promise((resolve, reject) => {
        // Check duplicate
        db.query("SELECT * FROM category WHERE cname=?", [name], (err, rows) => {
            if (err) return reject(err);
            if (rows.length > 0) {
                return reject({ code: "DUPLICATE", message: "Category name already exists" });
            }

            // Insert if no duplicate
            db.query("INSERT INTO category (cname) VALUES(?)", [name], (err2, result) => {
                if (err2) return reject(err2);
                resolve(result);
            });
        });
    });
};

// Get all categories
exports.getViewCategory = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM category ", (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

// Update category
exports.CategoryUpdate = (id, name) => {
    return new Promise((resolve, reject) => {
        // Check duplicate excluding current id
        db.query("SELECT * FROM category WHERE cname=? AND cid<>?", [name, id], (err, rows) => {
            if (err) return reject(err);
            if (rows.length > 0) {
                return reject({ code: "DUPLICATE", message: "Category name already exists" });
            }

            db.query("UPDATE category SET cname=? WHERE cid=?", [name, id], (err2, result) => {
                if (err2) return reject(err2);
                resolve(result);
            });
        });
    });
};

// 
exports.CategoryDelete = (id) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM category WHERE cid=?", [id], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

// Search category by name
exports.categorysearch = (name) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM category WHERE cname LIKE ?", [`%${name}%`], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};
