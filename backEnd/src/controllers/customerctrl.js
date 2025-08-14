let model_cust=require("../models/customermodel.js");

// Add a new customer
exports.AddCustomer=(req,res)=>
{
    let {name,email,phone_no,company_name,address,gstNumber} = req.body;
    if (!name || !email || !phone_no || !company_name || !address || !gstNumber) {
        return res.status(400).send("All fields are required");
    }
        let promise=model_cust.saveCustomer(name, email, phone_no, company_name,address,gstNumber);
    
        promise.then((result)=>
        {
           
            res.send("customer saved successfully...");
            
        }).catch((err)=>
        {
            
            res.send("customer not saved..."+err);
        });
}
// View all customers
exports.viewAllCustomer=(req,res)=>{
    let promise=model_cust.Viewcustomer();
     promise.then((result)=>
        {
           
            res.send(result);
            
        }).catch((err)=>
        {
            
            res.send("customer not saved..."+err);
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
           // res.send(result);
            
        }).catch((err)=>
        {
            
            res.send("customer not found .."+err);
        });

    }
    // Update customer by ID
    exports.UpdateCustomer=(req,res)=>
    {
        let id=req.params.id;
        let{name,email,phone_no,company_name,address,gstNumber}=req.body;
        let promise=model_cust.UpdateByid(id,name,email,phone_no,company_name,address,gstNumber);
        promise.then((result)=>
        {
           
            res.send("done...");
            
        }).catch((err)=>
        {
            
            res.send("invalid data .."+err);
        });

    }
    // delete customer by ID
exports.CustomerDelete=(req,res)=>
{
    let id=req.params.id;
        
        let promise=model_cust.DeleteByID(id);
        promise.then((result)=>
        {
           
            res.send("deleted ...");
            
        }).catch((err)=>
        {
            
            res.send("invalid data .."+err);
        });

}