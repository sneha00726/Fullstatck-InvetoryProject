
let salesModel = require("../models/salesmodel.js");

exports.addSale = (req, res) => {
    let { invoiceNo, salesDate, customerId, items, paymentMode, gstInvoice } = req.body;
    if (!invoiceNo || !salesDate || !customerId || !items || items.length === 0 || !paymentMode || gstInvoice === undefined) {
            return reject(new Error("All fields are required"));
        }
    let  promise=salesModel.createSale(invoiceNo, salesDate, customerId, items, paymentMode, gstInvoice);
    promise.then((result) => {
        res.status(201).json(result);
    }).catch((err) => {
        res.send("Purchase not saved: " + err.message);
    });
}

exports.ViewAllSales=(req,res)=>
{
    let promise=salesModel.viewSales();
    promise.then((result)=>
    {
      res.status(201).json(result);

    }).catch((err)=>
    {
        res.send(err);
    });
}

exports.GetbyIDSales=(req,res)=>
{
    let id = req.params.id;
    let promise=salesModel.getSalebyID(id);
    promise.then((result)=>{
        res.status(201).json(result);
    }).catch((err)=>
    {
         res.send(err);

    });
}


exports.updateSalesById=(req,res)=>
{
    let id=req.params.id;
    let {salesDate,customerId,paymentMode,gstInvoice}=req.body;
   let promise=salesModel.updateSales(id,salesDate,customerId,paymentMode,gstInvoice);
    promise.then((result)=>{
        res.status(201).json(result);
    }).catch((err)=>
    {
         res.send(err);

    });
}

exports.deleteSalesById=(req,res)=>
{
    console.log("hit the delete salws");
    let id = req.params.id;
    let promise=salesModel.salesDelete(id);
    promise.then((result)=>{
        res.status(201).json(result);
    }).catch((err)=>
    {
         res.send(err);

    });
}