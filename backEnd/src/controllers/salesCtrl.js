
let salesModel = require("../models/salesmodel.js");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

require("pdfkit-table");

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


exports.updateSalesById = (req, res) => {
  let id = req.params.id;
  let {  paymentMode,  items } = req.body;

  salesModel.updateSales(id, paymentMode,  items)
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json({ error: err.message }));
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




exports.downloadInvoice = (req, res) => {
  const { id } = req.params;

  salesModel
    .getInvoiceData(id) // this returns a Promise
    .then((rows) => {
      if (!rows || rows.length === 0) {
        return res.status(404).send("Invoice not found");
      }

      const sale = rows[0];
      const doc = new PDFDocument();

      // set headers
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=invoice_${sale.invoiceNo}.pdf`
      );

      doc.pipe(res);

      // try logo
      try {
        doc.image("public/Imges/INVENZA-.png", 30, 20, { width: 200 });
      } catch (e) {
        console.log("Logo not found, skipping...");
      }

      doc.moveDown(3);

      // header
      doc.fontSize(20).text("Invoice", { align: "right" }).moveDown();
      doc.fontSize(12).text(`Invoice No: ${sale.invoiceNo}`);
      doc.text(`Date: ${new Date(sale.salesDate).toLocaleDateString()}`);
      doc.text(`Customer: ${sale.customer_name} (${sale.company_name})`);
      doc.text(`Email: ${sale.email}`);
      doc.text(`Payment Mode: ${sale.paymentMode}`).moveDown();

      // products list
      doc.fontSize(12).text("Products:", { underline: true }).moveDown();
     rows.forEach((item, idx) => {
  const pname = item.product_name || "Unknown Product"; // fallback
  const qty = Number(item.qty) || 0;
  const rate = Number(item.rate) || 0;
  const lineTotal = (qty * rate).toFixed(2);

  doc.text(
    `${idx + 1}. ${pname} - Qty: ${qty} x ₹${rate.toFixed(2)} = ₹${lineTotal}`
  );
});

      // total
      doc.moveDown()
        .fontSize(14)
        .text(`Total Amount: ₹${sale.totalAmount}`, { align: "right" });

      doc.end();
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error generating invoice");
    });
};