let db = require("../../db.js");
/**
 * Add Purchase
 */

// Add a new purchase
exports.addPurchase = ({ invoiceno, purchasedate, supplierid, paymentmode, gstinvoice, items }) => {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(items) || items.length === 0) {
            return reject(new Error("No purchase items provided"));
        }

        // Calculate total amount
        let totalAmount = 0;
        items.forEach(item => totalAmount += item.price * item.quantity);


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

/**
 * View All Purchases
 */
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

/**
 * Get Purchase by ID
 */
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

/**
 * Update Purchase by ID
 */
exports.updatePurchaseById = (id, purchaseData) => {
  return new Promise((resolve, reject) => {
    const { invoiceno, purchasedate, supplierid, paymentmode, gstinvoice, items } = purchaseData;

    if (!Array.isArray(items) || items.length === 0) {
      return reject(new Error("No items provided for update"));
    }

    let totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    db.beginTransaction(err => {
      if (err) return reject(err);

      // Step 1: Get old items
      db.query("SELECT productid, quantity FROM purchase_items WHERE purchaseid = ?", [id], (err1, oldItems) => {
        if (err1) return db.rollback(() => reject(err1));

        // Step 2: Revert old stock
        let revertPromises = oldItems.map(item => {
          return new Promise((res, rej) => {
            db.query("UPDATE product SET stock = stock - ? WHERE pid = ?", [item.quantity, item.productid], err => {
              if (err) return rej(err);
              res();
            });
          });
        });

        Promise.all(revertPromises)
          .then(() => {
            // Step 3: Update purchase table
            const sqlPurchase = `
              UPDATE purchase
              SET invoiceno = ?, purchasedate = ?, supplierid = ?, totalamount = ?, paymentmode = ?, gstinvoice = ?
              WHERE id = ?
            `;
            db.query(sqlPurchase, [invoiceno, purchasedate, supplierid, totalAmount, paymentmode, gstinvoice, id], err2 => {
              if (err2) return db.rollback(() => reject(err2));

              // Step 4: Update items
              let updateItemPromises = items.map(item => {
                return new Promise((res, rej) => {
                  db.query(
                    "UPDATE purchase_items SET productid = ?, quantity = ?, price = ? WHERE id = ? AND purchaseid = ?",
                    [item.productid, item.quantity, item.price, item.id, id],
                    err3 => {
                      if (err3) return rej(err3);
                      res();
                    }
                  );
                });
              });

              Promise.all(updateItemPromises)
                .then(() => {
                  // Step 5: Apply new stock
                  let applyStockPromises = items.map(item => {
                    return new Promise((res, rej) => {
                      db.query("UPDATE product SET stock = stock + ? WHERE pid = ?", [item.quantity, item.productid], err4 => {
                        if (err4) return rej(err4);
                        res();
                      });
                    });
                  });

                  Promise.all(applyStockPromises)
                    .then(() => {
                      db.commit(err5 => {
                        if (err5) return db.rollback(() => reject(err5));
                        resolve({ message: "Purchase updated successfully", totalAmount });
                      });
                    })
                    .catch(err => db.rollback(() => reject(err)));
                })
                .catch(err => db.rollback(() => reject(err)));
            });
          })
          .catch(err => db.rollback(() => reject(err)));
      });

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

                    // Update product stock
                    let updateStockPromises = items.map(item => new Promise((res, rej) => {
                        db.query("UPDATE product SET stock = stock + ? WHERE pid = ?", [item.quantity, item.productid], err3 => {
                            if (err3) return rej(err3);
                            res();
                        });
                    }));

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

// Update purchase by ID
exports.updatePurchaseById = (id, purchaseData) => {
    return new Promise((resolve, reject) => {
        const { invoiceno, purchasedate, supplierid, paymentmode, gstinvoice, items } = purchaseData;

        if (!Array.isArray(items) || items.length === 0) {
            return reject(new Error("No items provided for update"));
        }

        let totalAmount = 0;
        for (let item of items) {
            if (!item.id || !item.productid || !item.quantity || !item.price) {
                return reject(new Error("Each item must have valid id, productid, quantity, and price"));
            }
            totalAmount += item.price * item.quantity;
        }

        db.beginTransaction(err => {
            if (err) return reject(err);

            // Get old items
            db.query("SELECT productid, quantity FROM purchase_items WHERE purchaseid = ?", [id], (err, oldItems) => {
                if (err) return db.rollback(() => reject(err));

                // Revert old stock
                const revertStockPromises = oldItems.map(item => new Promise((res, rej) => {
                    db.query("UPDATE product SET stock = stock - ? WHERE pid = ?", [item.quantity, item.productid], err => {
                        if (err) return rej(err);
                        res();
                    });
                }));

                Promise.all(revertStockPromises)
                    .then(() => {
                        // Update purchase data
                        const sqlPurchase = `
                            UPDATE purchase
                            SET invoiceno = ?, purchasedate = ?, supplierid = ?, totalamount = ?, paymentmode = ?, gstinvoice = ?
                            WHERE id = ?
                        `;
                        db.query(sqlPurchase, [invoiceno, purchasedate, supplierid, totalAmount, paymentmode, gstinvoice, id], err1 => {
                            if (err1) return db.rollback(() => reject(err1));

                            // Update purchase items
                            const updateItemPromises = items.map(item => new Promise((res, rej) => {
                                db.query(
                                    "UPDATE purchase_items SET productid = ?, quantity = ?, price = ? WHERE id = ? AND purchaseid = ?",
                                    [item.productid, item.quantity, item.price, item.id, id],
                                    err2 => {
                                        if (err2) return rej(err2);
                                        res();
                                    }
                                );
                            }));

                            Promise.all(updateItemPromises)
                                .then(() => {
                                    // Apply new stock
                                    const applyStockPromises = items.map(item => new Promise((res, rej) => {
                                        db.query("UPDATE product SET stock = stock + ? WHERE pid = ?", [item.quantity, item.productid], err3 => {
                                            if (err3) return rej(err3);
                                            res();
                                        });
                                    }));

                                    Promise.all(applyStockPromises)
                                        .then(() => {
                                            db.commit(err3 => {
                                                if (err3) return db.rollback(() => reject(err3));
                                                resolve({ message: "Purchase updated successfully", totalAmount });
                                            });
                                        })
                                        .catch(err => db.rollback(() => reject(err)));
                                })
                                .catch(err => db.rollback(() => reject(err)));
                        });
                    })
                    .catch(err => db.rollback(() => reject(err)));
            });
        });

    });
};

/**
 * Delete Purchase
 */
exports.deletePurchaseById = (id) => {
  return new Promise((resolve, reject) => {
    if (!id) return reject(new Error("Purchase ID missing"));

    db.beginTransaction(err => {
      if (err) return reject(err);

      db.query("DELETE FROM purchase_items WHERE purchaseid = ?", [id], (err1) => {
        if (err1) return db.rollback(() => reject(err1));

        db.query("DELETE FROM purchase WHERE id = ?", [id], (err2, result) => {
          if (err2) return db.rollback(() => reject(err2));
          db.commit(err3 => {
            if (err3) return db.rollback(() => reject(err3));
            resolve(result);
          });
        });
      });
    });
  });
};


/**
 * Search Purchase
 */

// Search purchase

exports.searchPurchase = (searchTerm) => {
    return new Promise((resolve, reject) => {
        const likeTerm = `%${searchTerm}%`;
        const sql = `
            SELECT p.id AS purchaseid, p.invoiceno, p.purchasedate, p.supplierid, s.name AS suppliername,
                   p.totalamount, p.paymentmode, p.gstinvoice
            FROM purchase p
            JOIN supplier s ON p.supplierid = s.sid
            WHERE p.invoiceno LIKE ? OR s.name LIKE ?
        `;
        db.query(sql, [likeTerm, likeTerm], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}
