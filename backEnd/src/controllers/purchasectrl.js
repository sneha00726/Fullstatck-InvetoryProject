<<<<<<< HEAD
let purmodel=require("../models/purchasemodel.js");
//let {validatePurchase}=require("../validation/purchasevalidation.js")
exports.addPurchase = (req, res) => {
    let { invoiceno, purchasedate, supplierid, paymentmode, gstinvoice, items } = req.body;

    // Calculate totalamount here
    let totalamount = 0;
    if (items && Array.isArray(items)) {
        totalamount = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
    }

    // Pass as object
    let promise = purmodel.addPurchase({
        invoiceno,
        purchasedate,
        supplierid,
        totalamount,
        paymentmode,
        gstinvoice,
        items
    });

    promise.then((result) => {
        res.json({ message: "Purchase added successfully", purchaseId: result.purchaseId, totalamount });
    }).catch((error) => {
        console.error("Error while saving purchases", error);
        res.status(500).json({ message: "Purchase not saved", error: error.message });
    });
};
=======
let purModel=require("../models/purchasemodel.js");
let {validatePurchase}=require("../validation/purchasevalidation.js")

exports.addPurchase = async (req, res) => {
  let { invoiceno, purchasedate, supplierid, paymentmode, gstinvoice, items } = req.body;
>>>>>>> e17f7941dbb5972d8e97dd32203882f229a4a475

  let errors = validatePurchase(invoiceno, purchasedate, supplierid, paymentmode, gstinvoice, items);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    let result = await purModel.addPurchase({ invoiceno, purchasedate, supplierid, paymentmode, gstinvoice, items });
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

exports.viewPurchases = async (req, res) => {
  try {
    let purchases = await purModel.viewPurchases();
    res.json(purchases);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch purchases" });
  }
};

exports.getPurchaseById = async (req, res) => {
  try {
    let id = req.params.id;
    let purchase = await purModel.getPurchaseById(id);

    if (!purchase || purchase.length === 0) {
      return res.status(404).json({ error: "Purchase not found" });
    }

    res.json(purchase);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch purchase" });
  }
};

exports.updatePurchaseById = async (req, res) => {
  try {
    let id = req.params.id;
    let purchaseData = req.body;

    // optionally validate purchaseData.items here if you want

    let result = await purModel.updatePurchaseById(id, purchaseData);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to update purchase" });
  }
};

exports.deletePurchaseById = async (req, res) => {
  try {
    let id = req.params.id;
    await purmodel.deletePurchaseById(id);
    res.json({ message: "Purchase deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete purchase" });
  }
};

exports.purchasesearch = async (req, res) => {
  try {
    let searchTerm = req.params.name;
    if (!searchTerm) {
      return res.status(400).json({ error: "Search term is required" });
    }
    let results = await purModel.searchPurchase(searchTerm);
    if (results.length === 0) {
      return res.status(404).json({ message: "No matching purchases found" });
    }
    res.json(results);
  } catch (err) {
    console.error("Purchase search error:", err);
    res.status(500).json({ error: "Failed to search purchases" });
  }
};
