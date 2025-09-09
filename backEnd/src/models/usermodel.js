let db = require("../../db.js");
let bcrypt = require("bcrypt");

// Create user with hashed password
exports.createUser = async (name, email, role, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      
      db.query(`SELECT * FROM user WHERE email = ?`, [email], async (err, results) => {
        if (err) return reject(err);

        if (results.length > 0) {
          return reject(new Error("Duplicate email found, user already exists"));
        }

        // Hash password
        let hashedPassword = await bcrypt.hash(password, 10);

        db.query(
          `INSERT INTO user (name, email, role, password) VALUES (?, ?, ?, ?)`,
          [name, email, role, hashedPassword],
          (err, result) => {
            if (err) return reject(err);
            resolve({ message: "User created", userId: result.insertId });
          }
        );
      });
    } catch (err) {
      reject(err);
    }
  });
};
// View all users
exports.viewUsers = () => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT id, name, email, role FROM user`, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};



// Update user
exports.updateUser = (id, name, email, role) => {
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE user SET name=?, email=?, role=? WHERE id=?`,
      [name, email, role, id],
      (err, result) => {
        if (err) return reject(err);
        resolve({ message: "User updated", affectedRows: result.affectedRows });
      }
    );
  });
};

// Delete user
exports.deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    db.query(`DELETE FROM user WHERE id=?`, [id], (err, result) => {
      if (err) return reject(err);
      resolve({ message: "User deleted", affectedRows: result.affectedRows });
    });
  });
};

// Search users by keyword (name or email)
exports.searchUsers = (keyword) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT id, name, email, role FROM user WHERE name LIKE ? OR email LIKE ?`,
      [`%${keyword}%`, `%${keyword}%`],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};
