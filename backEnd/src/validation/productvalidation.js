exports.validateProduct=(pname,price,supplier_id,cid,stock)=>{
    let errors = [];

    if (!pname || typeof pname !== "string" || pname.trim() === "") 
    {
        errors.push("Product name is required.");
    }

    if (!price || isNaN(price) || price <= 0) {
        errors.push("Valid price is required.");
    }

    if (!supplier_id || isNaN(supplier_id)) {
        errors.push("Valid supplier Id is required.");
    }

    if (!cid || isNaN(cid)) {
        errors.push("Valid category Id is required.");
    }

    if (!stock || isNaN(stock) || stock < 0) {
        errors.push("Valid stock quantity is required.");
    }

    return errors;
};

exports.validateId=(id)=>
{
    if(!id || id.trim() === "" || isNaN(id))
    {
        let error={message: "Valid Id is required"};
        return error;
    }
    return null;
};