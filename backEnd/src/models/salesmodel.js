
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

exports.updateSaleItem = (itemId, productId, quantity, rate, saleId) => {
  return new Promise((resolve, reject) => {
    if (!itemId) {
      // Insert new item
      db.query(
        "INSERT INTO sales_items (salesId, productId, qty, rate) VALUES (?, ?, ?, ?)",
        [saleId, productId, quantity, rate],
        (err, result) => {
          if (err) return reject(err);

exports.updateSales = (id, salesDate, customerId, paymentMode, gstInvoice, items) => {
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE sales SET salesDate=?, customerId=?, paymentMode=?, gstInvoice=? WHERE salesId=?`,
      [salesDate, customerId, paymentMode, gstInvoice, id],
      (err, result) => {
        if (err) return reject(err);

        // delete old items and insert new
        db.query(`DELETE FROM sales_items WHERE salesId=?`, [id], (err2) => {
          if (err2) return reject(err2);

          const values = items.map(it => [id, it.productId, it.qty]);
          db.query(`INSERT INTO sales_items (salesId, productId, qty) VALUES ?`, [values], (err3) => {
            if (err3) return reject(err3);
            resolve({ message: "Sale updated successfully", saleId: id });
          });
        });
      }
    );
  });
};



          // Deduct stock
          db.query("UPDATE product SET qty = qty - ? WHERE pid=?", [quantity, productId], err2 => {
            if (err2) return reject(err2);
            resolve(result);
          });
        }
      );
    } else {
      // Update existing item
      db.query("SELECT productId, qty FROM sales_items WHERE itemId=?", [itemId], (err, rows) => {
        if (err) return reject(err);
        if (rows.length === 0) return reject("Sale item not found");

        const oldProductId = rows[0].productId;
        const oldQty = rows[0].qty;

        // Restore old stock
        db.query("UPDATE product SET qty = qty + ? WHERE pid=?", [oldQty, oldProductId], err1 => {
          if (err1) return reject(err1);

          // Deduct new qty
          db.query("UPDATE product SET qty = qty - ? WHERE pid=?", [quantity, productId], err2 => {
            if (err2) return reject(err2);

            db.query(
              "UPDATE sales_items SET productId=?, qty=?, rate=? WHERE itemId=?",
              [productId, quantity, rate, itemId],
              (err3, result) => {
                if (err3) return reject(err3);
                resolve(result);
              }
            );
          });
        });
      });
    }
  });
};
exports.getTotalAmount = saleId => {
  return new Promise((resolve, reject) => {
    db.query("SELECT SUM(qty * rate) AS total FROM sales_items WHERE salesId=?", [saleId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

exports.updateTotalAmount = (saleId, totalAmount) => {
  return new Promise((resolve, reject) => {
    db.query("UPDATE sales SET totalAmount=? WHERE salesId=?", [totalAmount, saleId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
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
