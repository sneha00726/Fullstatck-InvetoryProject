const userModel = require("../models/usermodel.js");
let {validateUser}=require("../validation/UserValidation.js");
// Add user
exports.addUser = (req, res) => {
  const { name, email, role, password } = req.body;

  if (!name || !email || !role || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }
  const errors = validateUser(name, email, password);
      if (errors.length > 0) {
          return res.status(400).json({ message: "Validation failed", errors });
      }
  userModel.createUser(name, email, role, password)
    .then(result => {
      res.status(201).json({ success: true, message: "User created successfully", result });
    })
    .catch(err => {
      res.status(400).json({ success: false, message: err.message }); // send exact error
    });
};

// View all users
exports.viewUsers = (req, res) => {
  const promise = userModel.viewUsers();

  promise.then(users => {
    res.status(200).json({ success: true, users });
  }).catch(err => {
    res.status(500).json({ success: false, message: "Unable to fetch users", error: err.message });
  });
};



// Update user
exports.updateUser = (req, res) => {
  const id = req.params.id;
  const { name, email, role } = req.body;
  const promise = userModel.updateUser(id, name, email, role);

  promise.then(result => {
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "User not found or not updated" });
    }
    res.status(200).json({ success: true, message: "User updated successfully" });
  }).catch(err => {
    res.status(500).json({ success: false, message: "User update failed", error: err.message });
  });
};

// Delete user
exports.deleteUser = (req, res) => {
  const id = req.params.id;
  const promise = userModel.deleteUser(id);

  promise.then(result => {
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "User not found or already deleted" });
    }
    res.status(200).json({ success: true, message: "User deleted successfully" });
  }).catch(err => {
    res.status(500).json({ success: false, message: "User deletion failed", error: err.message });
  });
};

// Search users
exports.searchUsers = (req, res) => {
  const keyword = req.params.keyword;
  const promise = userModel.searchUsers(keyword);

  promise.then(users => {
    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, message: "No users found" });
    }
    res.status(200).json({ success: true, users });
  }).catch(err => {
    res.status(500).json({ success: false, message: "User search failed", error: err.message });
  });
};
