const db = require("../../db.js");

// Create user
exports.createUser = (name, email, role, password) => {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO user (name, email, role, password) VALUES (?, ?, ?, ?)`,
      [name, email, role, password],
      (err, result) => {
        if (err) return reject(err);
        resolve({ message: "User created", userId: result.insertId });
      }
    );
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

// Get user by ID
exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT id, name, email, role FROM user WHERE id=?`, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result[0]); // return single object
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
