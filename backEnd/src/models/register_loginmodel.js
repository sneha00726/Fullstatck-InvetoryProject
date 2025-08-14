let db=require("../../db.js");

exports.FindByEmail=(email)=>{

    return new Promise((resolve,reject)=>
    {
        db.query("select *from user where email=?",[email],(err,result)=>
        {
            if(err)
            {
                reject(err); //if there is any error
            }
            else{
               resolve(result);
            }

        });
        });

}
exports.InsertUser=(name,email,password,role)=>{
    return new Promise((resolve,reject)=>
    {
        db.query("insert into user(name,email,password,role) values(?,?,?,?)",[name,email,password,role],(err,result)=>
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

exports.ValidateLogin=(email)=>
{
    return new Promise((resolve,reject)=>
    {
        db.query("select *from user where email=?",[email],(err,result)=>
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