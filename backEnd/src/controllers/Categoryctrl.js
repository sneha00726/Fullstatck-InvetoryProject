let model_cat=require("../models/Categorymodel.js");

exports.createCategory=(req,res)=>
{
    let {name}=req.body;
     if (!name) {
        return res.status(400).json({ message: "Category name is required" });  //if name is empty
    }
   // console.log("im in controller");
    let promise=model_cat.CreateCategoryAdd(name);
    promise.then((result)=>
    {
        //console.log("data save");
       res.status(201).json({ message: "Category saved successfully" });
    }).catch((err)=>
    {
        res.status(409).json({ message: "data is not save duplicate entry not allowed" });
       
    });

}

exports.getAllCategory=(req,res)=>
{
    let promise=model_cat.getViewCategory();
    promise.then((result)=>
    {
        res.status(200).json(result);
    }).catch((err)=>
    {
        res.status(500).json({ message: "Failed to retrieve data"});
    });

}
exports.getCategoryById=(req,res)=>
{
     let id  = req.params.id; 
     if (!id) {
        return res.status(400).json({ message: "Category id is required" });
    }
    //console.log("id");
    let promise=model_cat.getIdCategory(id);
    promise.then((result)=>
    {
        if(result.length==0)
        {
            res.status(404).json({ message: "Category not found with given ID" });
        }else{
             res.status(200).json(result);
        }
       
    }).catch((err)=>
    {
        res.send("Invalid ID"+err);
    });
}
exports.UpdateCategory=(req,res)=>
{
    //console.log("PUT update route called");
    let id=req.params.id;
    let {name}=req.body;
    if (!name) {
        return res.status(400).json({ message: "Category name is required to update" });
    }

    let promsie=model_cat.CategoryUpdate(id,name);
    promsie.then((result)=>
    {
        if(result.affectedRows === 0)
        {
            res.status(404).json({ message: "Category not found or wrong ID" });
        }else
        {
           // console.log("router hited updat");
       res.status(200).json({ message: "Category updated successfully" })
        }
        
    }).catch((err)=>
    {
        res.status(500).json({ message: "Failed to update category"});
    });
}

exports.DeleteCategory=(req,res)=>
{
    //console.log("PUT update route called");
    let id=req.params.id;
    if (!id) {
        return res.status(400).json({ message: "Category id is required" });
    }
    //let {name}=req.body;
    let promsie=model_cat.CategoryDelete(id);
    promsie.then((result)=>
    {
        if(result.affectedRows === 0)
        {
            res.status(404).json({ message: "Category not found or wrong ID" });
        }else
        {
           res.status(200).json({ message: "Category deleted successfully" });
        }
        
    }).catch((err)=>
    {
        res.status(500).json({ message: "Failed to delete category"});    });
}
