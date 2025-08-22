let db=require("../../db.js");

exports.createSale = (invoiceNo, salesDate, customerId, items, paymentMode, gstInvoice) => {
    return new Promise((resolve, reject) => {
        // Fetch price for each product
        let totalAmount = 0;

        let fetchPricesPromises = items.map(item => 
        {
            return new Promise((res, rej) => 
            {
                if (!item.productId || !item.qty) 
                {
                    return rej(new Error("Each item must have productId and qty"));
                }
                db.query( `SELECT price FROM product WHERE pid = ?`, [item.productId],(err, result) => {
                        if (err) return rej(err);
                        if (result.length === 0) 
                            return rej(new Error(`Product ID ${item.productId} not found`));

                        let rate = parseFloat(result[0].price);
                        let subtotal = rate * item.qty;
                        totalAmount += subtotal;

                        // Attach rate to the item for later insert
                        item.rate = rate;

                        res();
                    }
                );
            });
        });
        Promise.all(fetchPricesPromises)
            .then(() => {
                // Insert into sales table
                db.query(`INSERT INTO sales (invoiceNo, salesDate, customerId, totalAmount, paymentMode, gstInvoice)VALUES (?, ?, ?, ?, ?, ?)`,
                    [invoiceNo, salesDate, customerId, totalAmount, paymentMode, gstInvoice], (err, salesResult) => {
                        if (err) 
                            return reject(err);

                        const saleId = salesResult.insertId;

                        // Insert items into sales_items table
                        let insertItemPromises = items.map(item => {
                            return new Promise((res, rej) => {
                                db.query( `INSERT INTO sales_items (salesId, productId, qty, rate) VALUES (?, ?, ?, ?)`,[saleId, item.productId, item.qty, item.rate],
                                    (err) => {
                                        if (err) return rej(err);
                                        res();
                                    }
                                );
                            });
                        });

                        Promise.all(insertItemPromises)
                            .then(() => {
                                resolve({ message: "Sale created successfully", saleId, totalAmount });//msg print saelsid and total amount
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
exports.updateSales=(id,salesDate,customerId,paymentMode,gstInvoice)=>
{
    return new Promise((resolve,reject)=>
    {
        db.query(`UPDATE sales 
             SET  salesDate=?, customerId=?, paymentMode=?, gstInvoice=? 
             WHERE salesId=?`,[salesDate,customerId,paymentMode,gstInvoice,id],(err,result)=>
                {
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

exports.salesDelete=(id)=>{
 
    return new Promise((resolve,reject)=>
    {
        db.query(`delete from sales where salesId=?`,[id],(err,result)=>{
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