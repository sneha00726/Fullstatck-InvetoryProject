// Import the database connection
let db=require("../../db.js");

// add customer data
exports.saveCustomer = (name, email, phone_no, company_name, address, gstNumber) => {
    return new Promise((resolve, reject) => {

        //  Check if email or GST already exists
       db.query("SELECT id FROM customer WHERE email = ? OR gstNumber = ?", [email, gstNumber], (checkErr, results) => {
            if (checkErr) {
                return reject(checkErr); // Return error if duplicate check query fails
            }

            if (results.length > 0) {
                return reject(new Error("Duplicate entry: Email or GST number already exists"));
            }

            // Insert only if no duplicate
            db.query("INSERT INTO customer (name, email, phone_no, company_name, address, gstNumber) VALUES (?, ?, ?, ?, ?, ?)", [name, email, phone_no, company_name, address, gstNumber], (err, result) => {
                if (err) {
                    return reject(err); // Return error if query fails
                }
                resolve(result); // Return result on success
            });
        });
    });
};

// view all customer data
exports.Viewcustomer=()=>
{
    return new Promise((resolve,reject)=>
    {
        db.query("select *from customer",(err,result)=>
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
// get customer data by ID
exports.getCustomerById=(id)=>
{
    return new Promise((resolve,reject)=>
    {
        db.query("select *from customer where id=?",[id],(err,result)=>
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
// Update customer data by ID
exports.UpdateByid=(id,name,email,phone_no,company_name,address,gstNumber)=>
{
    return new Promise((resolve,reject)=>
    {
        db.query("update customer set name=? ,email=?,phone_no=?,company_name=?,address=?,gstNumber=? where id=?",[name,email,phone_no,company_name,address,gstNumber,id],(err,result)=>
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
// delete customer data by ID
exports.DeleteByID=(id)=>
{
    return new Promise((resolve,reject)=> 
    {
        db.query("delete from customer where id=?",[id],(err,result)=>
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