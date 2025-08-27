let model_cust=require("../models/customermodel.js");
let { validateCustomer } = require("../validation/customervalidation.js");
// Add a new customer
exports.AddCustomer=(req,res)=>
{
    let {name,email,phone_no,company_name,address,gstNumber} = req.body;
     const errors = validateCustomer(name, email, phone_no, company_name, address, gstNumber);
    if (errors.length > 0) {
        return res.status(400).json({ message: "Validation failed", errors });
    }
    if (!name || !email || !phone_no || !company_name || !address || !gstNumber) {
        return res.status(400).send("All fields are required");
    }
        let promise=model_cust.saveCustomer(name, email, phone_no, company_name,address,gstNumber);
    
        promise.then((result)=>
        {
           
             res.status(201).json({ message: "Customer saved successfully", data: result });
            
        }).catch((err)=>
        {
            
            res.status(500).json({ message: "Customer not save with same email ", error: err });
        });
}
// View all customers
exports.viewAllCustomer=(req,res)=>{
    let promise=model_cust.Viewcustomer();
     promise.then((result)=>
        {
           
           res.status(200).json(result);
            
        }).catch((err)=>
        {
            
             res.status(500).json({ message: "Error fetching customers", error: err });
        });

}
// Get customer by ID
    exports.customerGetById=(req,res)=>
    {
        let id=req.params.id;
        let promise=model_cust.getCustomerById(id);
     promise.then((result)=>
        {  // If customer not found, return 404
           if (result.length === 0) {
                res.status(404).send("Customer not found for ID: " + id);
            } else {
                res.status(200).send(result);// Send customer data
            }
           
            
        }).catch((err)=>
        {
            
          res.status(500).json({ message: "Error fetching customers", error: err });
        });

    }
    // Update customer by ID
    // Update customer by ID
exports.UpdateCustomer = (req, res) => {
    let id = req.params.id;
    let { name, email, phone_no, company_name, address, gstNumber } = req.body;

    let promise = model_cust.UpdateByid(id, name, email, phone_no, company_name, address, gstNumber);

    promise.then((result) => {
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Customer not found for ID: " + id });
        }
        res.status(200).json({ message: "Customer updated successfully" });
    }).catch((err) => {
        res.status(500).json({ message: "Error updating customer", error: err });
    });
};

// Delete customer by ID
exports.CustomerDelete = (req, res) => {
    let id = req.params.id;

    let promise = model_cust.DeleteByID(id);
    promise.then((result) => {
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Customer not found for ID: " + id });
        }
        res.status(200).json({ message: "Customer deleted successfully" });
    }).catch((err) => {
        res.status(500).json({ message: "Error deleting customer", error: err });
    });
};

exports.CustSearch = (req, res) => {
    let name = req.params.name; //
    let promise = model_cust.searchCustomer(name);

    promise.then((result) => {
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "No purchase found" });
        }
    }).catch((err) => {
        res.status(500).json({ error: err.message });
    });
};
