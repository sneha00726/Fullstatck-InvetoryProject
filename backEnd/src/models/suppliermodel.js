let db = require("../../db.js");
exports.addSupplier=(name,email,phone,companyname,address,gstnumber) =>{

    return new Promise((resolve,reject)=>{
        db.query("insert into supplier(name,email,phone,companyname,address,gstnumber) values (?,?,?,?,?,?)",[name,email,phone,companyname,address,gstnumber],
            (err,result)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            }
        );
    });
};

exports.viewSuppliers=()=>
{
    return new Promise((resolve,reject)=>
    {
        db.query("select * from supplier",
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

exports.getSupplierById=(id)=>
{
    return new Promise((resolve, reject)=>
    {
        db.query("select *from supplier where sid=?",[id],
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

exports.updateSupplierById=(id,name,email,phone,companyname,address,gstnumber)=>{
    return new Promise((resolve,reject)=>{
        db.query("update supplier set name=?, email=?, phone=?, companyname=?, address=?, gstnumber=? where sid=?",[name,email,phone,companyname,address,gstnumber,id],(err,result)=>
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

exports.deleteSupplierById=(id)=>{
    return new Promise((resolve,reject)=>
    {
        db.query("delete from supplier where sid=?",[id],
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

exports.searchSupplierByName = (name) => {
    return new Promise((resolve, reject) => {
        db.query(
            "SELECT * FROM supplier WHERE name LIKE ?",
            [`%${name}%`],
            (err, result) => {
                if (err) reject(err);
                else resolve(result);
            }
        );
    });
};
