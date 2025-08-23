let db = require("../../db.js");

// Add purchase
exports.addPurchase = ({ invoiceno, purchasedate, supplierid, paymentmode, gstinvoice, items }) => {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(items) || items.length === 0) {
      return reject(new Error("No purchase items provided"));
    }

    let totalAmount = 0;
    for (let item of items) {
      if (
        !item ||
        typeof item.productid !== "number" ||
        typeof item.price !== "number" ||
        typeof item.quantity !== "number"
      ) {
        return reject(new Error("Each item must have valid productid, price, and quantity"));
      }
      totalAmount += item.price * item.quantity;
    }

    db.beginTransaction(err => {
      if (err) return reject(err);

      const purchaseSql = `
        INSERT INTO purchase (invoiceno, purchasedate, supplierid, totalamount, paymentmode, gstinvoice)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.query(purchaseSql, [invoiceno, purchasedate, supplierid, totalAmount, paymentmode, gstinvoice], (err1, result1) => {
        if (err1) return db.rollback(() => reject(err1));

        const purchaseId = result1.insertId;

        const itemsSql = "INSERT INTO purchase_items (purchaseid, productid, quantity, price) VALUES ?";
        const itemValues = items.map(item => [purchaseId, item.productid, item.quantity, item.price]);

        db.query(itemsSql, [itemValues], (err2) => {
          if (err2) return db.rollback(() => reject(err2));

          // Update stock
          let updateStockPromises = items.map(item => {
            return new Promise((res, rej) => {
              db.query("UPDATE product SET stock = stock + ? WHERE pid = ?", [item.quantity, item.productid], (err3) => {
                if (err3) return rej(err3);
                res();
              });
            });
          });

          Promise.all(updateStockPromises)
            .then(() => {
              db.commit(err3 => {
                if (err3) return db.rollback(() => reject(err3));
                resolve({ message: "Purchase added successfully", purchaseId, totalAmount });
              });
            })
            .catch(err => db.rollback(() => reject(err)));
        });
      });
    });
  });
};

// View all purchases
exports.viewPurchases = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT p.id AS purchaseid, p.invoiceno, p.purchasedate, p.supplierid,
             s.name AS suppliername, p.totalamount, p.paymentmode, p.gstinvoice,
             pi.id AS itemid, pi.productid, pr.pname AS productname, pi.quantity, pi.price
      FROM purchase p
      JOIN supplier s ON p.supplierid = s.sid
      JOIN purchase_items pi ON p.id = pi.purchaseid
      JOIN product pr ON pi.productid = pr.pid
      ORDER BY p.id DESC
    `;
    db.query(sql, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Get purchase by ID
exports.getPurchaseById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT p.id AS purchaseid, p.invoiceno, p.purchasedate, p.supplierid,
             s.name AS suppliername, p.totalamount, p.paymentmode, p.gstinvoice,
             pi.id AS itemid, pi.productid, pr.pname AS productname, pi.quantity, pi.price
      FROM purchase p
      JOIN supplier s ON p.supplierid = s.sid
      JOIN purchase_items pi ON p.id = pi.purchaseid
      JOIN product pr ON pi.productid = pr.pid
      WHERE p.id = ?
    `;
    db.query(sql, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Update purchase
exports.updatePurchaseById = (id, purchaseData) => {
  return new Promise((resolve, reject) => {
    const { invoiceno, purchasedate, supplierid, paymentmode, gstinvoice, items } = purchaseData;

    if (!Array.isArray(items) || items.length === 0) {
      return reject(new Error("No items provided for update"));
    }

    let totalAmount = 0;
    for (let item of items) {
      if (!item || typeof item.productid !== "number" || typeof item.quantity !== "number" || typeof item.price !== "number" || typeof item.id !== "number") {
        return reject(new Error("Each item must have valid id, productid, quantity, and price"));
      }
      totalAmount += item.price * item.quantity;
    }

    db.beginTransaction(err => {
      if (err) return reject(err);

      const sqlPurchase = `
        UPDATE purchase
        SET invoiceno = ?, purchasedate = ?, supplierid = ?, totalamount = ?, paymentmode = ?, gstinvoice = ?
        WHERE id = ?
      `;
      db.query(sqlPurchase, [invoiceno, purchasedate, supplierid, totalAmount, paymentmode, gstinvoice, id], (err1) => {
        if (err1) return db.rollback(() => reject(err1));

        const updateItemPromises = items.map(item => {
          return new Promise((res, rej) => {
            const sqlUpdateItem = `
              UPDATE purchase_items
              SET productid = ?, quantity = ?, price = ?
              WHERE id = ? AND purchaseid = ?
            `;
            db.query(sqlUpdateItem, [item.productid, item.quantity, item.price, item.id, id], (err2) => {
              if (err2) return rej(err2);
              res();
            });
          });
        });

        Promise.all(updateItemPromises)
          .then(() => {
            db.commit(err3 => {
              if (err3) return db.rollback(() => reject(err3));
              resolve({ message: "Purchase and items updated successfully", totalAmount });
            });
          })
          .catch(err4 => db.rollback(() => reject(err4)));
      });
    });
  });
};

// Delete purchase
exports.deletePurchaseById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM purchase WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Search purchase by supplier name (join required)
exports.searchPurchase = (name) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT p.id AS purchaseid, p.invoiceno, p.purchasedate, p.supplierid,
             s.name AS suppliername, p.totalamount, p.paymentmode, p.gstinvoice
      FROM purchase p
      JOIN supplier s ON p.supplierid = s.sid
      WHERE s.name LIKE ?
    `;
    db.query(sql, [`%${name}%`], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
