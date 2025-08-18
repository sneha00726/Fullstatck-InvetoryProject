let smodel = require("../models/suppliermodel.js");
let { validateSupplier } = require("../validation/suppliervalidation.js");

exports.addSupplier = (req, res) => {
    console.log("router hit ");
    let { name, email, phone, companyname, address, gstnumber } = req.body;
    let errors = validateSupplier(name, email, phone, companyname, address, gstnumber);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    let promise = smodel.addSupplier(name, email, phone, companyname, address, gstnumber);

     promise.then((result) => {
        console.log("Insert result:", result);
        res.status(201).json({ message: "Supplier saved successfully", result });
    }).catch((err) => {
        console.error("Insert error:", err);
        res.status(500).json({ error: "Supplier not saved", details: err });
    });
};

exports.viewSuppliers = (req, res) => {
    let promise = smodel.viewSuppliers();

    promise.then((result) => {
        res.send(result);
    }).catch((err) => {
        res.send("Data not found");
    });
};

exports.getSupplierById = (req, res) => {
    let id = req.params.id;

    let promise = smodel.getSupplierById(id);
    promise.then((result) => {
        res.send(result);
    }).catch((err) => {
        res.send("Data not found");
    });
};

exports.updateSupplierById = (req, res) => {   
    let id = req.params.id;
    let { name, email, phone, companyname, address, gstnumber } = req.body;

    let promise = smodel.updateSupplierById(id, name, email, phone, companyname, address, gstnumber);

    promise.then((result) => {
        if (result.affectedRows === 0) {
            res.send("Supplier not updated");
        } else {
            res.send("Supplier updated");
        }
    }).catch((err) => {
        res.send("Supplier not updated");
    });
};

exports.deleteSupplierById = (req, res) => {
    let id = req.params.id;
   
    let promise = smodel.deleteSupplierById(id);
    promise.then((result) => {
        if (result.affectedRows === 0) {
            res.send("Supplier not deleted");
        } else {
            res.send("Supplier deleted successfully");
        }
    }).catch((err) => {
        res.send("Supplier not deleted");
    });
};
