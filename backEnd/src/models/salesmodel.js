
let db=require("../../db.js");


exports.createSale = (invoiceNo, salesDate, customerId, items, paymentMode, gstInvoice) => {
  return new Promise((resolve, reject) => {
    let totalAmount = 0;

    // Validate products and calculate total
    let fetchPricesPromises = items.map(item => {
      return new Promise((res, rej) => {
        db.query(`SELECT price, stock, pname FROM product WHERE pid=?`, [item.productId], (err, result) => {
          if (err) return rej(err);
          if (result.length === 0) return rej(new Error(`Product ${item.productId} not found`));

          const product = result[0];
          if (product.stock < item.qty) return rej(new Error(`Out of stock for Product ID ${item.productId}`));

          item.rate = product.price;          // snapshot of price
          item.product_name = product.pname;  // snapshot of name
          totalAmount += product.price * item.qty;
          res();
        });
      });
    });

    // Insert into sales and sales_items
    Promise.all(fetchPricesPromises)
      .then(() => {
        db.query(
          `INSERT INTO sales (invoiceNo, salesDate, customerId, totalAmount, paymentMode, gstInvoice)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [invoiceNo, salesDate, customerId, totalAmount, paymentMode, gstInvoice],
          (err, salesResult) => {
            if (err) return reject(err);

            const saleId = salesResult.insertId;

            let tasks = items.map(item => {
              return new Promise((res, rej) => {
                db.query(
                  `INSERT INTO sales_items (salesId, productId, qty, rate, product_name) VALUES (?, ?, ?, ?, ?)`,
                  [saleId, item.productId, item.qty, item.rate, item.product_name],
                  (err) => {
                    if (err) return rej(err);

                    // Reduce stock
                    db.query(
                      `UPDATE product SET stock = stock - ? WHERE pid=?`,
                      [item.qty, item.productId],
                      (err2) => { if (err2) return rej(err2); res(); }
                    );
                  }
                );
              });
            });

            Promise.all(tasks)
              .then(() => resolve({ message: "Sale created successfully", saleId, totalAmount }))
              .catch(err => reject(err));
          }
        );
      })
      .catch(err => reject(err));
  });
};

// viewSales
exports.viewSales = () => {
  return new Promise((resolve, reject) => {
    db.query(`
      SELECT s.salesID, s.invoiceNo, s.salesDate, s.totalAmount, s.paymentMode, s.gstInvoice,
             c.id as customer_id, c.name as customer_name, c.email, c.company_name,
             si.product_name, si.qty, si.rate as product_price
      FROM sales s
      JOIN customer c ON s.customerId=c.id
      JOIN sales_items si ON s.salesID=si.salesID
    `, (err, result) => err ? reject(err) : resolve(result));
  });
};

// getSalebyID
exports.getSalebyID = (id) => {
  return new Promise((resolve, reject) => {
    db.query(`
      SELECT s.salesID, s.invoiceNo, s.salesDate, s.totalAmount, s.paymentMode, s.gstInvoice,
             c.id as customer_id, c.name as customer_name, c.email, c.company_name,
             si.product_name, si.qty, si.rate as product_price
      FROM sales s
      JOIN customer c ON s.customerId=c.id
      JOIN sales_items si ON s.salesID=si.salesID
      WHERE s.salesID=?
    `, [id], (err, result) => err ? reject(err) : resolve(result));
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
