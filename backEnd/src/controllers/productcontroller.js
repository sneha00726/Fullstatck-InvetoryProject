let pmodel=require("../models/productmodel.js");
let {validateProduct,validateId}=require("../validation/productvalidation.js"); 
exports.addProduct = (req, res) => {
    let { pname, price, cid, stock } = req.body;

    let errors = validateProduct(pname, price,cid,stock);
    if (errors.length > 0) {
        return res.status(422).json({
            errorMsg: "validation error",
            message: errors.join(", ")
        });
    }

    pmodel.saveProduct(pname, price, cid, stock)
        .then((result) => {
            res.status(201).json({
                message: "Product saved successfully",
                productId: result.insertId
            });
        })
        .catch((err) => {
            if (err.message === "Product name already exists") {
                return res.status(409).json({ message: err.message });
            }
            console.error("DB error:", err);
            res.status(500).json({ message: "Failed to save product", error: err.message });
        });
};

exports.viewProducts=(req,res)=>
{
    let promise=pmodel.viewProducts();

    promise.then((result)=>
    {
        res.send(result);
        //console.log(result);

    }).catch((err)=>
    {
        res.send("Data not found");
        //console.log("Data not found");
    });
};

exports.getProdById=(req,res)=>
{
    let id=req.params.id;
    let error=validateId(id);
    if(error)
    {
        return res.status(400).json(error);
    }
    let promise=pmodel.getProdById(id);
    promise.then((result)=>
    {
        res.send(result);
        //console.log(result);

    }).catch((err)=>
    {
        res.send("Data not found");
        //console.log("Data not found");
    });
};

exports.updateProdById=(req,res)=>
{   
    let id=req.params.id;
    let {pname,price,cid}=req.body;
    /*let errors=validateProduct(pname,price,cid);
    if(errors.length>0)
    {
        return res.status(400).json({errors});
    }*/
    let promise=pmodel.updateProdById(id,pname,price,cid);
    promise.then((result)=>
    {
       if(result.affectedRows === 0)
        {
            console.log("Product not updated");
           // res.send("Product not updated");
        }
        else
        {
            res.send("Product updated ");
            // console.log("Product updated");
        }
    }).catch((err)=>
    {
        res.send("Product not updated");
    });
}

exports.deleteProdById=(req,res)=>
{
    let id=req.params.id;
    let error=validateId(id);
    if(error)
    {
        res.status(400).json(error);
    }
    let promise=pmodel.deleteProdById(id);
    promise.then((result)=>
    {
        if(result.affectedRows === 0)
        {
             res.status(404).json({'message':'Record not Deleted'});
            //console.log("Product not deleted");
        }
        else
        {
            res.status(200).json({'message':'Record Deleted'});
        }
    }).catch((err)=>
    {
       res.status(404).json({'message':'Record not Deleted'+err});
        //console.log("Product not deleted");
    });
}

exports.searchProdByName = (req, res) => {
    let name = req.params.name; //
    let promise = pmodel.searchProdByName(name);

    promise.then((result) => {
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "No products found" });
        }
    }).catch((err) => {
        res.status(500).json({ error: err.message });
    });
};