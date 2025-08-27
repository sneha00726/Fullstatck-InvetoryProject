let dash_model=require("../models/dashboardmodel.js");
exports.dashboard=(req,res)=>
{
    let promise=dash_model.dashmodel();
    promise.then((result)=>
    {
         res.status(200).json(result); 
    }).catch((err)=>
    {
        res.status(500).json({ message: "Error fetching dashboard data", error: err });
    })
}