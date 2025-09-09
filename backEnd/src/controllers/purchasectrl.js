let purModel = require("../models/purchasemodel.js");
let { validatePurchase } = require("../validation/purchasevalidation.js");

// Add new purchase
exports.addPurchase = async (req, res) => {
  const { invoiceno, purchasedate, supplierid, paymentmode, gstinvoice, items } = req.body;

  const errors = validatePurchase(invoiceno, purchasedate, supplierid, paymentmode, gstinvoice, items);
  if (errors.length) return res.status(400).json({ errors });

  try {
    const result = await purModel.addPurchase({
      invoiceno,
      purchasedate,
      supplierid,
      paymentmode,
      gstinvoice,
      items,
    });
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

// View all purchases
exports.viewPurchases = async (req, res) => {
  try {
    const purchases = await purModel.viewPurchases();
    res.json(purchases);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch purchases" });
  }
};

// Get purchase by ID
exports.getPurchaseById = async (req, res) => {
  try {
    const purchase = await purModel.getPurchaseById(req.params.id);
    if (!purchase || purchase.length === 0)
      return res.status(404).json({ error: "Purchase not found" });
    res.json(purchase);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch purchase" });
  }
};

// Update purchase
exports.updatePurchaseById = async (req, res) => {
  try {
    const result = await purModel.updatePurchaseById(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to update purchase" });
  }
};

// Delete purchase
exports.deletePurchaseById = async (req, res) => {
  const id = parseInt(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid purchase id" });

  try {
    await purModel.deletePurchaseById(id);
    res.json({ message: "Purchase deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete purchase" });
  }
};

// Search purchase
exports.purchasesearch = async (req, res) => {
  try {
    const searchTerm = req.params.name;
    if (!searchTerm) return res.status(400).json({ error: "Search term is required" });

    const results = await purModel.searchPurchase(searchTerm);
    if (results.length === 0) return res.status(404).json({ message: "No matching purchases found" });

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to search purchases" });
  }
};
