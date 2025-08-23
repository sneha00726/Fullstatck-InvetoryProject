let db=require("../../db.js");

exports.addPurchase=(invoiceno,purchasedate,supplierid,paymentmode,gstinvoice,items)=>
{
    return new Promise((resolve,reject)=> 
    {
        if(!Array.isArray(items) || items.length === 0) 
        {
            return reject(new Error("No purchase items provided"));
        }

        let totalAmount = 0;

        // Validate and calculate total
        for(let item of items) 
        {
            if(
                !item ||
                typeof item.productid !== "number" ||
                typeof item.price !== "number" ||
                typeof item.quantity !== "number"
            ) 
            {
                return reject(new Error("Each item must have valid productid, price, and quantity"));
            }
            totalAmount=totalAmount+item.price * item.quantity;
        }
        db.beginTransaction((err)=>
        {
            if (err) return reject(err);

            let purchaseSql=`
                insert into purchase (invoiceno,purchasedate,supplierid,totalamount, paymentmode,gstinvoice)
                values (?, ?, ?, ?, ?, ?)
            `;

            db.query(
                purchaseSql,
                [invoiceno,purchasedate,supplierid,totalAmount,paymentmode,gstinvoice],
                (err1,result1)=>
                {
                    if (err1) return db.rollback(() => reject(err1));

                    let purchaseId=result1.insertId;
                    let itemsSql=`
                        insert into purchase_items (purchaseid, productid, quantity, price)
                        values ?
                    `;
                    let itemValues=items.map(item=>[purchaseId,item.productid,item.quantity, item.price]);

                    db.query(itemsSql,[itemValues],(err2)=>
                    {
                        if (err2) return db.rollback(()=>reject(err2));

                        db.commit((err3)=>
                        {
                            if (err3) return db.rollback(()=>reject(err3));

                            resolve({
                                message: "Purchase added successfully",
                                purchaseId,
                                totalAmount
                            });
                        });
                    });
                }
            );
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
        let {invoiceno,purchasedate,supplierid,paymentmode,gstinvoice,items}=purchaseData;

        if(!Array.isArray(items) || items.length === 0) 
        {
            return reject(new Error("No items provided for update"));
        }

        let totalAmount=0;

        // Validate and calculate totalAmount
        for(let item of items) 
        {
            if(
                !item ||
                typeof item.productid !== "number" ||
                typeof item.quantity !== "number" ||
                typeof item.price !== "number" ||
                typeof item.id !== "number"
            ) 
            {
                return reject(new Error("Each item must have valid id, productid, quantity, and price"));
            }
            totalAmount=totalAmount+item.price*item.quantity;
        }

        db.beginTransaction(err=>
        {
            if(err) return reject(err);

            let sqlPurchase=`
                update purchase 
                set invoiceno=?, purchasedate=?, supplierid=?, totalamount=?, paymentmode=?, gstinvoice=?
                where id=?
            `;

            db.query(
                sqlPurchase,
                [invoiceno,purchasedate,supplierid,totalAmount,paymentmode,gstinvoice,id],
                (err1)=>
                {
                    if(err1) return db.rollback(()=>reject(err1));

                    let updateItemPromises=items.map(item=> 
                    {
                        return new Promise((res,rej)=> 
                        {
                            let sqlUpdateItem=`
                                update purchase_items 
                                set productid = ?, quantity = ?, price = ? 
                                where id = ? and purchaseid = ?
                            `;
                            db.query(sqlUpdateItem,[item.productid,item.quantity,item.price, item.id,id],(err2)=> 
                            {
                                if (err2) return rej(err2);
                                res();
                            });
                        });
                    });
                    Promise.all(updateItemPromises)
                        .then(()=>
                        {
                            db.commit((err3)=>
                            {
                                if (err3) return db.rollback(()=>reject(err3));
                                
                                resolve({ message: "Purchase and items updated successfully", totalAmount});
                            });
                        })
                        .catch(err4=>db.rollback(()=>reject(err4)));
                }
            );
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
            "SELECT * FROM purchase WHERE cname LIKE ?",
            [`%${name}%`],
            (err, result) => {
                if (err) reject(err);
                else resolve(result);
            }
        );
    });
};
