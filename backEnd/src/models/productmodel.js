let db = require("../../db.js");

exports.saveProduct=(pname, price, supplier_id, cid, stock) =>{

    return new Promise((resolve,reject)=>{
        db.query("insert into product(pname, price, supplier_id, cid, stock) values (?, ?, ?, ?, ?)",[pname, price, supplier_id, cid, stock],
            (err,result)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            }
        );
    });
}

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

exports.getProdById=(id)=>
{
    return new Promise((resolve, reject)=>
    {
        db.query("select *from product where pid=?",[id],
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

exports.updateProdById=(id,pname,price,supplier_id,cid,stock)=>{
    return new Promise((resolve,reject)=>{
        db.query("update product set pname=?, price=?, supplier_id=?, cid=?, stock=? where pid=?",[pname,price,supplier_id,cid,stock,id],(err,result)=>
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

exports.deleteProdById=(id)=>{
    return new Promise((resolve,reject)=>
    {
        db.query("delete from product where pid=?",[id],
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

exports.searchProdByName = (name) => {
    return new Promise((resolve, reject) => {
        db.query(
            "select * from product where pname like ?",
            [`%${name}%`],
            (err, result) => {
                if (err) reject(err);
                else resolve(result);
            }
        );
    });
};