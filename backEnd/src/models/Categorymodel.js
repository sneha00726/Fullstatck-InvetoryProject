let db=require("../../db.js");

exports.CreateCategoryAdd=(name)=>
{
    return new Promise((resolve,reject)=>
    {
        db.query("insert into category (cname) values(?)",[name],(err,result)=>
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

exports.getViewCategory=()=>
{
    return new Promise((resolve,reject)=>
    {
        db.query("select *from category",(err,result)=>
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


exports.getIdCategory=(id)=>
{
    return new Promise((resolve,reject)=>
    {
        db.query("select *from category where cid=?",[id],(err,result)=>
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

exports.CategoryUpdate=(id,name)=>
{
    return new Promise((resolve,reject)=>
    {
        db.query("update category set cname=? where cid=?",[name,id],(err,result)=>
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

exports.CategoryDelete=(id)=>
{
    return new Promise((resolve,reject)=>
    
    {
        db.query("delete from category  where cid=?",[id],(err,result)=>
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

exports.categorysearch = (name) => {
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
