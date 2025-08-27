
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
        res.send("sales not saved: " + err.message);
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


exports.updateSalesById = async (req, res) => {
  let id = req.params.id;
  let { salesDate, customerId, paymentMode, gstInvoice, items } = req.body;

  try {
    // 1. Update sale main info
    await salesModel.updateSales(id, salesDate, customerId, paymentMode, gstInvoice);

    // 2. Update or add sale items
    if (items && items.length > 0) {
      for (let item of items) {
        if (item.itemId) {
          await salesModel.updateSaleItem(item.itemId, item.productId, item.qty, item.rate, id);
        } else {
          await salesModel.updateSaleItem(null, item.productId, item.qty, item.rate, id);
        }
      }
    }

    // 3. Recalculate totalAmount
    const totalResult = await salesModel.getTotalAmount(id); // You need to create this query in model
    const totalAmount = totalResult[0].total || 0;

    await salesModel.updateTotalAmount(id, totalAmount); // Update sales table

    res.status(200).json({ message: "Sale updated successfully", totalAmount });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
};
exports.deleteSalesById=(req,res)=>
{
    //console.log("hit the delete salws");
    let id = req.params.id;
    let promise=salesModel.salesDelete(id);
    promise.then((result)=>{
        res.status(201).json(result);
    }).catch((err)=>
    {
         res.send(err);

    });
}
exports.salesSearch = (req, res) => {
    let invoiceNo  = req.params.invoiceNo ; //
    let promise = salesModel.searchsales(invoiceNo );

    promise.then((result) => {
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "No sales found" });
        }
    }).catch((err) => {
        res.status(500).json({ error: err.message });
    });
};