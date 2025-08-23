let db = require("../../db.js");

exports.createSale = (invoiceNo, salesDate, customerId, items, paymentMode, gstInvoice) => {
  return new Promise((resolve, reject) => {
    let totalAmount = 0;

    // Step 1: Validate products and calculate total
    let fetchPricesPromises = items.map(item => {
      return new Promise((res, rej) => {
        if (!item.productId || !item.qty) {
          return rej(new Error("Each item must have productId and qty"));
        }

        db.query(`SELECT price, stock FROM product WHERE pid=?`, [item.productId], (err, result) => {
          if (err) return rej(err);
          if (result.length === 0) return rej(new Error(`Product ID ${item.productId} not found`));

          let product = result[0];
          if (product.stock < item.qty) return rej(new Error(`Out of stock for Product ID ${item.productId}`));

          item.rate = product.price; // price per unit
          totalAmount += product.price * item.qty; // subtotal
          res();
        });
      });
    });

    // Step 2: Insert into sales and sales_items
    Promise.all(fetchPricesPromises)
      .then(() => {
        db.query(
          `INSERT INTO sales (invoiceNo, salesDate, customerId, totalAmount, paymentMode, gstInvoice)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [invoiceNo, salesDate, customerId, totalAmount, paymentMode, gstInvoice],
          (err, salesResult) => {
            if (err) return reject(err);

            const saleId = salesResult.insertId;

            // Insert each item into sales_items and update stock
            let tasks = items.map(item => {
              return new Promise((res, rej) => {
                db.query(
                  `INSERT INTO sales_items (salesId, productId, qty, rate) VALUES (?, ?, ?, ?)`,
                  [saleId, item.productId, item.qty, item.rate],
                  (err) => {
                    if (err) return rej(err);

                    // Reduce stock
                    db.query(
                      `UPDATE product SET stock = stock - ? WHERE pid=?`,
                      [item.qty, item.productId],
                      (err2) => {
                        if (err2) return rej(err2);
                        res();
                      }
                    );
                  }
                );
              });
            });

            Promise.all(tasks)
              .then(() => {
                resolve({
                  message: "Sale created successfully",
                  saleId,
                  totalAmount
                });
              })
              .catch(err => reject(err));
          }
        );
      })
      .catch(err => reject(err));
  });
};
