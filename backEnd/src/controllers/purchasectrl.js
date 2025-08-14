let purmodel=require("../models/purchasemodel.js");
let {validatePurchase}=require("../validation/purchasevalidation.js")

exports.addPurchase=(req,res)=>
{
        let {invoiceno, purchasedate, supplierid, totalamount, paymentmode, gstinvoice, items}=req.body;
        let errors=validatePurchase(invoiceno, purchasedate, supplierid, totalamount, paymentmode, gstinvoice, items);
        if(errors.length)
        {
            return res.status(400).json({errors});
        }
        let promise=purmodel.addPurchase(invoiceno, purchasedate, supplierid, totalamount, paymentmode, gstinvoice, items);
        promise.then((result)=>
        {
            res.send("Purchase added successfully");
        }).catch((error)=>
        {
            console.error("Error while saving purchases", error); 
            res.send("Purchase not saved: " + error.message);
        });
}

exports.viewPurchases=(req,res)=>{
    let promise = purmodel.viewPurchases();

    promise.then((result) => 
    {
        res.send(result);
    }).catch((error)=> 
    {
        res.send("Error while fetching purchases");
    });
}

exports.getPurchaseById=(req,res)=>
{
    let id = req.params.id;
    let promise = purmodel.getPurchaseById(id);

    promise.then((result)=>
    {
        res.send(result);
    }).catch((error)=> 
    {
        res.json({ error: "Error while fetching purchase by ID" });
    });
}

exports.updatePurchaseById=(req,res)=>
{
    let id=req.params.id;
    let purchaseData=req.body;

    let promise=purmodel.updatePurchaseById(id,purchaseData);
    promise.then((result)=>
    {
        res.send({message: "Purchase updated successfully"});
    }).catch((error)=> 
    {
        res.json({error: "Error while updating purchase"});
    });
}

exports.deletePurchaseById=(req, res)=>{
    let id = req.params.id;

    let promise=purmodel.deletePurchaseById(id);
    promise.then((result)=> 
    {
        res.send({message: "Purchase deleted successfully"});
    }).catch((error) => 
    {
        res.json({ error: "Error while deleting purchase" });
    });
}



