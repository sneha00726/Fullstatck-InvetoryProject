let db = require("../../db.js");

exports.addPurchase=(invoiceno, purchasedate, supplierid, totalamount, paymentmode, gstinvoice, items)=>{
    return new Promise((resolve, reject)=>{

        db.beginTransaction((err)=>{
            if(err)
            {
                return reject(err);
            }

            db.query("insert into purchase(invoiceno, purchasedate, supplierid, totalamount, paymentmode, gstinvoice)values (?, ?, ?, ?, ?, ?)",[invoiceno, purchasedate, supplierid, totalamount,paymentmode,gstinvoice],(err1,result1)=>
            {
                if(err1) 
                {
                    return db.rollback(()=>reject(err1));
                }

                let purchaseId=result1.insertId;

                let itemsSql=`insert into purchase_items(purchaseid, productid, quantity, price)
                    values ?`;

                let itemValues=items.map(item=>[purchaseId,item.productid,item.quantity,item.price
                ]);

                db.query(itemsSql,[itemValues],(err2,result2)=>{
                    if(err2) 
                    {
                        return db.rollback(() => reject(err2));
                    }
                    db.commit((err3) => 
                    {
                        if (err3) 
                        {
                            return db.rollback(() => reject(err3));
                        }
                        resolve({result2});
                    });
                });
            });
        });
    });
}

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
        });
    });
}

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
    });
}

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
    });
};
