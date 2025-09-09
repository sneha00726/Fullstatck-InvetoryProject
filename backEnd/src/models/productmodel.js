let db = require("../../db.js");

exports.saveProduct = (pname, price, cid, stock) => {
    return new Promise((resolve, reject) => {

        //  Check for duplicate product name
        const checkSql = "SELECT pid FROM product WHERE pname = ?";
        db.query(checkSql, [pname], (err, results) => {
            if (err) return reject(err);

            if (results.length > 0) {
                return reject(new Error("Product name already exists"));
            }

            //  Insert new product
            const insertSql = "INSERT INTO product(pname, price, cid, stock) VALUES (?, ?, ?, ?)";
            db.query(insertSql, [pname, price, cid, stock], (err2, result) => {
                if (err2) reject(err2);
                else resolve(result);
            });
        });
    });
};


exports.viewProducts=()=>
{
    return new Promise((resolve,reject)=>
    {
        db.query("select *from product",
        (err,result)=>
        {
            if(err)
            {
                reject(err);
            }
            else
            {
                resolve(result);
            }
        });
    });
}



exports.updateProdById=(id,pname,price,cid)=>{
    return new Promise((resolve,reject)=>{
        db.query("update product set pname=?, price=?, cid=? where pid=?",[pname,price,cid,id],(err,result)=>
        {
            if(err)
            {
                reject(err);
            }
            else
            {
                resolve(result);
            }
        });
    });
}
exports.deleteProdById = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "DELETE FROM product WHERE pid = ?",
      [id],
      (err, result) => {
        if (err) return reject(err); 
        resolve(result);
      }
    );
  });
};

exports.searchProdByName = (name) => {
    return new Promise((resolve, reject) => {
        db.query(

            "SELECT * FROM product WHERE pname LIKE ?",

            [`%${name}%`],
            (err, result) => {
                if (err) reject(err);
                else resolve(result);
            }
        );
    });
};