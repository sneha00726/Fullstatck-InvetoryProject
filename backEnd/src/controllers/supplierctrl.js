
const smodel = require("../models/suppliermodel.js");
const { validateSupplier } = require("../validation/suppliervalidation.js");

exports.addSupplier = async (req, res) => {
  try {
    const { name, email, phone, companyname, address, gstnumber } = req.body;
    const errors = validateSupplier(name, email, phone, companyname, address, gstnumber);

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const result = await smodel.addSupplier(name, email, phone, companyname, address, gstnumber);
    return res.status(201).json({ success: true, message: "Supplier saved successfully", result });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Supplier not saved", error: err.message });
  }
};

exports.viewSuppliers = async (req, res) => {
  try {
    const result = await smodel.viewSuppliers();
    return res.status(200).json({ success: true, suppliers: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Unable to fetch suppliers", error: err.message });
  }
};

exports.getSupplierById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await smodel.getSupplierById(id);

    if (!result || result.length === 0) {
      return res.status(404).json({ success: false, message: "Supplier not found" });
    }

    return res.status(200).json({ success: true, supplier: result[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Unable to fetch supplier", error: err.message });
  }
};

exports.updateSupplierById = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, phone, companyname, address, gstnumber } = req.body;

    const result = await smodel.updateSupplierById(id, name, email, phone, companyname, address, gstnumber);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Supplier not found or not updated" });
    }

    return res.status(200).json({ success: true, message: "Supplier updated successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Supplier update failed", error: err.message });
  }
};

exports.deleteSupplierById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await smodel.deleteSupplierById(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Supplier not found or already deleted" });
    }

    return res.status(200).json({ success: true, message: "Supplier deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Supplier deletion failed", error: err.message });
  }
};

exports.searchSupplier = async (req, res) => {
  try {
    const name = req.params.name;
    const result = await smodel.searchSupplierByName(name);

    if (!result || result.length === 0) {
      return res.status(404).json({ success: false, message: "No suppliers found" });
    }

    return res.status(200).json({ success: true, suppliers: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Supplier search failed", error: err.message });
  }
};
