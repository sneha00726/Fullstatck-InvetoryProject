
let db=require("../../db.js");


exports.createSale = (invoiceNo, salesDate, customerId, items, paymentMode, gstInvoice) => {
  return new Promise((resolve, reject) => {
    let totalAmount = 0;

    // Validate products and calculate total
    let fetchPricesPromises = items.map(item => {
      return new Promise((res, rej) => {
        db.query(`SELECT price, stock FROM product WHERE pid=?`, [item.productId], (err, result) => {
          if (err) return rej(err);
          if (result.length === 0) return rej(new Error(`Product ${item.productId} not found`));

          let product = result[0];
          if (product.stock < item.qty) return rej(new Error(`Out of stock for Product ID ${item.productId}`));

          item.rate = product.price; // price per unit
          totalAmount += product.price * item.qty; // subtotal
          res();
        });
      });
    });

    //  Insert into sales and sales_items
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
exports.viewSales=()=>
{
    return new Promise((resolve,reject)=>
    {
         db.query(`select s.salesID,s.invoiceNo,s.salesDate,s.totalAmount,s.paymentMode,gstInvoice,c.id as customer_id,c.name as customer_name,
            c.email,c.company_name,p.pname as product_name ,si.qty,si.rate as product_price from sales s join customer c on s.customerId=c.id 
            join sales_items si on s.salesID=si.salesID join product p on si.productId=p.pid`,(err,result)=>{
                if(err)
                {
                    reject(err);
                }
                else{
                    resolve(result);
                }
            });
    });
}

exports.getSalebyID=(id)=>
{
    return new Promise((resolve,reject)=>
    {
        db.query(`select s.salesID,s.invoiceNo,s.salesDate,s.totalAmount,s.paymentMode,gstInvoice,c.id as customer_id,c.name as customer_name,
            c.email,c.company_name,p.pname as product_name ,si.qty,si.rate as product_price from sales s join customer c on s.customerId=c.id 
            join sales_items si on s.salesID=si.salesID join product p on si.productId=p.pid where s.salesId=?`,[id],(err,result)=>{
                if(err)
                {
                    reject(err);
                }
                else{
                    resolve(result);
                }
            });
        
    });
}

exports.updateSales = (id, paymentMode, items) => {
  return new Promise((resolve, reject) => {
    // Fetch old items
    db.query(`SELECT productId, qty FROM sales_items WHERE salesId=?`, [id], (err, oldItems) => {
      if (err) return reject(err);

      let oldMap = {};
      oldItems.forEach(it => oldMap[it.productId] = it.qty);

      let newMap = {};
      items.forEach(it => newMap[it.productId] = it.qty);

      let totalAmount = 0;
      let tasks = [];

      // Restore stock for removed products
      for (let oldPid in oldMap) {
        if (!newMap[oldPid]) {
          tasks.push(new Promise((res, rej) => {
            db.query(`UPDATE product SET stock = stock + ? WHERE pid=?`, [oldMap[oldPid], oldPid], (err2) => {
              if (err2) return rej(err2);
              db.query(`DELETE FROM sales_items WHERE salesId=? AND productId=?`, [id, oldPid], (err3) => {
                if (err3) return rej(err3);
                res();
              });
            });
          }));
        }
      }

      // Handle updated & new items
      items.forEach(it => {
        tasks.push(new Promise((res, rej) => {
          db.query(`SELECT price, stock FROM product WHERE pid=?`, [it.productId], (err4, result) => {
            if (err4) return rej(err4);
            if (result.length === 0) return rej(new Error("Product not found"));

            let product = result[0];
            let oldQty = oldMap[it.productId] || 0;
            let qtyDiff = it.qty - oldQty;

            if (qtyDiff > 0 && product.stock < qtyDiff) {
              return rej(new Error("Insufficient stock for product " + it.productId));
            }

            let rate = product.price;
            totalAmount += rate * it.qty;

            if (oldQty === 0) {
              // New product → insert
              db.query(`INSERT INTO sales_items (salesId, productId, qty, rate) VALUES (?, ?, ?, ?)`,
                [id, it.productId, it.qty, rate], (err5) => {
                  if (err5) return rej(err5);

                  if (qtyDiff > 0) {
                    db.query(`UPDATE product SET stock = stock - ? WHERE pid=?`, [qtyDiff, it.productId], (err6) => {
                      if (err6) return rej(err6);
                      res();
                    });
                  } else res();
                });
            } else {
              // Existing product → update qty
              db.query(`UPDATE sales_items SET qty=?, rate=? WHERE salesId=? AND productId=?`,
                [it.qty, rate, id, it.productId], (err7) => {
                  if (err7) return rej(err7);

                  if (qtyDiff !== 0) {
                    db.query(`UPDATE product SET stock = stock - ? WHERE pid=?`, [qtyDiff, it.productId], (err8) => {
                      if (err8) return rej(err8);
                      res();
                    });
                  } else res();
                });
            }
          });
        }));
      });

      Promise.all(tasks)
        .then(() => {
          // Update sales main table
          db.query(`UPDATE sales SET paymentMode=?, totalAmount=? WHERE salesId=?`,
            [paymentMode, totalAmount, id], (err9) => {
              if (err9) return reject(err9);
              resolve({ message: "Sale updated successfully", saleId: id, totalAmount });
            });
        })
        .catch(reject);
    });
  });
};


exports.salesDelete = (id) => {
  return new Promise((resolve, reject) => {
    db.query(`DELETE FROM sales_items WHERE salesId=?`, [id], (err) => {
      if (err) return reject(err);

      db.query(`DELETE FROM sales WHERE salesId=?`, [id], (err2, result) => {
        if (err2) return reject(err2);

        if (result.affectedRows === 0) {
          return reject(new Error("No sale found with this ID"));
        }

        resolve({ message: "Sale deleted", affectedRows: result.affectedRows });
      });
    });
  });
};
exports.searchsales = (invoiceNo ) => {
    return new Promise((resolve, reject) => {
        db.query(
            "SELECT * FROM sales WHERE invoiceNo  LIKE ?",
            [`%${invoiceNo }%`],
            (err, result) => {
                if (err) reject(err);
                else resolve(result);
            }
        );
    });
};


exports.getInvoiceData = (saleId, callback) => {
  const query = `
    SELECT s.salesID,s.invoiceNo,s.salesDate,s.totalAmount,s.paymentMode,
           c.name as customer_name,c.company_name,c.email,
           p.pname, si.qty, si.rate
    FROM sales s 
    JOIN customer c ON s.customerId=c.id 
    JOIN sales_items si ON s.salesID=si.salesID 
    JOIN product p ON si.productId=p.pid
    WHERE s.salesID=?`;

  db.query(query, [saleId], (err, rows) => {
    if (err) return callback(err, null);
    callback(null, rows);
  });
};
