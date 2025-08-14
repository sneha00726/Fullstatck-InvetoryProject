let smodel=require("../models/suppliermodel.js");
let {validateSupplier,validateId} =require("../validation/suppliervalidation.js");
exports.addSupplier=(req,res)=>{
    
    let {name,email,phone,companyname,address,gstnumber}=req.body;
    let errors=validateSupplier(name,email,phone,companyname,address,gstnumber);
    if(errors.length>0)
    {
        return res.status(400).json({errors});
    }
    let promise=smodel.addSupplier(name,email,phone,companyname,address,gstnumber);

    promise.then((result)=>
    {
        res.send("Supplier saved successfully...");
        //console.log("Supplier saved successfully");
        
    }).catch((err)=>
    {
        res.send("Supplier not saved...");
        //console.error("Supplier not saved");
    });
}

exports.viewSuppliers=(req,res)=>
{
    let promise=smodel.viewSuppliers();

    promise.then((result)=>
    {
        res.send(result);
       // console.log(result);

    }).catch((err)=>
    {
        res.send("Data not found");
        //console.log("Data not found");
    });
}

exports.getSupplierById=(req,res)=>
{
    let id=req.params.id;
    let error=validateId(id)
    if(error)
    {
        return res.status(400).json(error);
    }
    let promise=smodel.getSupplierById(id);
    promise.then((result)=>
    {
        res.send(result);
        //console.log(result);

    }).catch((err)=>
    {
        res.send("Data not found");
        //console.log("Data not found");
    });
}

exports.updateSupplierById=(req,res)=>
{   
    let id=req.params.id;
    let {name,email,phone,companyname,address,gstnumber}=req.body;
    let promise=smodel.updateSupplierById(id,name,email,phone,companyname,address,gstnumber);
    promise.then((result)=>
    {
       if(result.affectedRows === 0)
        {
            res.send("Supplier not updated");
            //console.log("Supplier not updated");
        }
        else
        {
            res.send("Supplier updated ");
            //console.log("Supplier updated");
        }
    }).catch((err)=>
    {
        res.send("Supplier not updated");
        //console.log("Supplier not updated");
    });
}

exports.deleteSupplierById=(req,res)=>
{
    let id=req.params.id;
    let error=validateId(id)
    if(error)
    {
        return res.status(400).json(error);
    }
    let promise=smodel.deleteSupplierById(id);
    promise.then((result)=>
    {
        if(result.affectedRows === 0)
        {
            res.send("Supplier not deleted");
            //console.log("Supplier not deleted");
        }
        else
        {
            res.send("Supplier deleted successfully");
            //console.log("Supplier deleted successfully");
        }
    }).catch((err)=>
    {
        res.send("Supplier not deleted");
        //console.log("Supplier not deleted");
    });
}