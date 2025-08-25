let db = require("../../db.js");

exports.addPurchase = ({ invoiceno, purchasedate, supplierid, paymentmode, gstinvoice, items }) => {
  return new Promise((resolve, reject) => {
<<<<<<< HEAD
    // Calculate total amount from items
    let totalamount = 0;
    if (items && items.length > 0) {
      totalamount = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
    }

    db.query(
      "INSERT INTO purchase (invoiceno, purchasedate, supplierid, totalamount, paymentmode, gstinvoice) VALUES (?, ?, ?, ?, ?, ?)",
      [invoiceno, purchasedate, supplierid, totalamount, paymentmode, gstinvoice],
      (err1, result1) => {
        if (err1) return reject(err1);
=======
    // Minimal check only: items must be an array and not empty
    if (!Array.isArray(items) || items.length === 0) {
      return reject(new Error("No purchase items provided"));
    }

    // Calculate total amount
    let totalAmount = 0;
    for (let item of items) {
      totalAmount += item.price * item.quantity; // Assume controller validated this
    }

    db.beginTransaction(err => {
      if (err) return reject(err);

      const purchaseSql = `
        INSERT INTO purchase (invoiceno, purchasedate, supplierid, totalamount, paymentmode, gstinvoice)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.query(purchaseSql, [invoiceno, purchasedate, supplierid, totalAmount, paymentmode, gstinvoice], (err1, result1) => {
        if (err1) return db.rollback(() => reject(err1));
>>>>>>> 7e4ec8a4 (UI created)

        const purchaseId = result1.insertId;

        if (!items || items.length === 0) 
          return resolve({ message: "Purchase added (no items)", purchaseId, totalamount });

        const itemsSql = "INSERT INTO purchase_items (purchaseid, productid, quantity, price) VALUES ?";
        const itemValues = items.map(item => [purchaseId, item.productId, item.qty, item.price]);

        db.query(itemsSql, [itemValues], (err2) => {
          if (err2) return reject(err2);

          // Update stock for each product
          let updateStockPromises = items.map(item => {
            return new Promise((res, rej) => {
              db.query("UPDATE product SET stock = stock + ? WHERE pid = ?", [item.qty, item.productId], (err3) => {
                if (err3) return rej(err3);
                res();
              });
            });
          });

          Promise.all(updateStockPromises)
            .then(() => resolve({ message: "Purchase added successfully", purchaseId, totalamount }))
            .catch(err => reject(err));
        });
<<<<<<< HEAD
=======
      });
    });
  });
};

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

exports.updatePurchaseById = (id, purchaseData) => {
  return new Promise((resolve, reject) => {
    const { invoiceno, purchasedate, supplierid, paymentmode, gstinvoice, items } = purchaseData;

    if (!Array.isArray(items) || items.length === 0) {
      return reject(new Error("No items provided for update"));
    }

    let totalAmount = 0;
    for (let item of items) {
      if (
        !item ||
        typeof item.productid !== "number" ||
        typeof item.quantity !== "number" ||
        typeof item.price !== "number" ||
        typeof item.id !== "number"
      ) {
        return reject(new Error("Each item must have valid id, productid, quantity, and price"));
>>>>>>> 7e4ec8a4 (UI created)
      }
    );
  });
};


<<<<<<< HEAD

exports.viewPurchases=()=>
{
    return new Promise((resolve,reject)=>
    {
        let sql= `select p.id as purchaseid, p.invoiceno, p.purchasedate, p.supplierid,
                   s.name as suppliername, p.totalamount, p.paymentmode, p.gstinvoice,

                   pi.id as itemid, pi.productid, pr.pname as productname, pi.quantity,
                   pi.price from purchase p join supplier s on p.supplierid = s.sid 
                   join
                   purchase_items pi on p.id = pi.purchaseid
                   join 
                   product pr on pi.productid = pr.pid
                   order by 
                   p.id desc
              `;
        db.query(sql,(err,result)=>
        {
            if(err)
            {
                return reject(err);
            }
            resolve(result);
=======
      // Step 1: Get old items before update
      const sqlOldItems = `SELECT productid, quantity FROM purchase_items WHERE purchaseid = ?`;
      db.query(sqlOldItems, [id], (err, oldItems) => {
        if (err) return db.rollback(() => reject(err));

        // Step 2: Revert old stock
        const revertStockPromises = oldItems.map(item => {
          return new Promise((res, rej) => {
            db.query(
              "UPDATE product SET stock = stock - ? WHERE pid = ?",
              [item.quantity, item.productid],
              err => {
                if (err) return rej(err);
                res();
              }
            );
          });
>>>>>>> 7e4ec8a4 (UI created)
        });
    });
}

<<<<<<< HEAD
exports.getPurchaseById=(id)=>
{
    return new Promise((resolve,reject)=>
    {
        let sql= `select p.id as purchaseid, p.invoiceno, p.purchasedate, p.supplierid,
                          s.name as suppliername, p.totalamount, p.paymentmode, p.gstinvoice,
                          pi.id as itemid, pi.productid, pr.pname as productname, 
                          pi.quantity, pi.price 
                          from purchase p 
                          join supplier s on p.supplierid = s.sid 
                          join purchase_items pi on p.id = pi.purchaseid
                          join product pr on pi.productid = pr.pid
                          where p.id = ?`;

        db.query(sql,[id], (err,result)=> 
        {
            if(err) 
            {
                return reject(err);
            }
            else{
            resolve(result);

            }
        });
    });
}

exports.updatePurchaseById=(id,purchaseData)=>
{
    return new Promise((resolve,reject)=>
    {
        let {invoiceno, purchasedate, supplierid, totalamount, paymentmode, gstinvoice, items}= purchaseData;

        let sqlPurchase = `update purchase set
                              invoiceno = ?, 
                              purchasedate = ?, 
                              supplierid = ?, 
                              totalamount = ?, 
                              paymentmode = ?, 
                              gstinvoice = ?
                              where id = ?`;

        db.query(sqlPurchase, [invoiceno, purchasedate, supplierid, totalamount, paymentmode, gstinvoice, id],(err,result)=> 
        {
            if (err) 
                return reject(err);

            // Update each purchase item one by one
            let updateItemPromises=items.map(item=> 
            {
                return new Promise((res,rej)=> 
                {
                    let sqlUpdateItem= `update purchase_items 
                                           set productid= ?, quantity= ?, price= ?
                                           where id= ? and purchaseid= ?`;
                    db.query(sqlUpdateItem, [item.productid, item.quantity, item.price, item.id, id],(err2)=> 
                    {
                        if(err2) 
                        return rej(err2);
                        res();
                    });
                });
            });

            //Wait for all item updates to finish
            Promise.all(updateItemPromises)
                .then(()=> resolve({message: "Purchase and items updated successfully." }))
                .catch(err3=> reject(err3));
        });
=======
        Promise.all(revertStockPromises)
          .then(() => {
            // Step 3: Update purchase data
            const sqlPurchase = `
              UPDATE purchase
              SET invoiceno = ?, purchasedate = ?, supplierid = ?, totalamount = ?, paymentmode = ?, gstinvoice = ?
              WHERE id = ?
            `;
            db.query(
              sqlPurchase,
              [invoiceno, purchasedate, supplierid, totalAmount, paymentmode, gstinvoice, id],
              err1 => {
                if (err1) return db.rollback(() => reject(err1));

                // Step 4: Update purchase items
                const updateItemPromises = items.map(item => {
                  return new Promise((res, rej) => {
                    const sqlUpdateItem = `
                      UPDATE purchase_items
                      SET productid = ?, quantity = ?, price = ?
                      WHERE id = ? AND purchaseid = ?
                    `;
                    db.query(
                      sqlUpdateItem,
                      [item.productid, item.quantity, item.price, item.id, id],
                      err2 => {
                        if (err2) return rej(err2);
                        res();
                      }
                    );
                  });
                });

                Promise.all(updateItemPromises)
                  .then(() => {
                    // Step 5: Apply new stock
                    const applyNewStockPromises = items.map(item => {
                      return new Promise((res, rej) => {
                        db.query(
                          "UPDATE product SET stock = stock + ? WHERE pid = ?",
                          [item.quantity, item.productid],
                          err3 => {
                            if (err3) return rej(err3);
                            res();
                          }
                        );
                      });
                    });

                    Promise.all(applyNewStockPromises)
                      .then(() => {
                        db.commit(err3 => {
                          if (err3) return db.rollback(() => reject(err3));
                          resolve({
                            message: "Purchase and items updated successfully",
                            totalAmount
                          });
                        });
                      })
                      .catch(err => db.rollback(() => reject(err)));
                  })
                  .catch(err => db.rollback(() => reject(err)));
              }
            );
          })
          .catch(err => db.rollback(() => reject(err)));
      });
    });
  });
};

exports.deletePurchaseById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM purchase WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
>>>>>>> 7e4ec8a4 (UI created)
    });
}

<<<<<<< HEAD
exports.deletePurchaseById=(id)=>{
    return new Promise((resolve,reject)=>{
        let sql = `delete from purchase where id = ?`;

        db.query(sql,[id],(err,result)=>{
            if(err){
                return reject(err);
            }
            resolve(result);
        });
    });
}





exports.searchpurchase = (name) => {
    return new Promise((resolve, reject) => {
        db.query(
            "SELECT * FROM category WHERE cname LIKE ?",
            [`%${name}%`],
            (err, result) => {
                if (err) reject(err);
                else resolve(result);
            }
        );
=======
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
>>>>>>> 7e4ec8a4 (UI created)
    });
};
