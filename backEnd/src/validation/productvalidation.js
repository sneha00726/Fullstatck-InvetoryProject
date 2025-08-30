exports.validateProduct = (pname, price, cid, stock) => {
    let errors = [];

    // Product name
     if (!pname || typeof pname !== "string" || pname.trim() === "") {
        errors.push("Product name is required.");
    } else {
        for (let i = 0; i < pname.length; i++) {
            let ch = pname[i];

            // Allow only uppercase, lowercase letters and space
            if (!(
                (ch >= "A" && ch <= "Z") ||
                (ch >= "a" && ch <= "z") ||
                ch === " "
            )) {
                errors.push("Product name must contain only alphabets and spaces.");
                break; // stop checking further once invalid char found
            }
        }
    }


    // Price
    price = Number(price);
    if (isNaN(price) || price <= 0) {
        errors.push("Valid price is required.");
    }

    // Category ID
    cid = Number(cid);
    if (isNaN(cid) || cid <= 0) {
        errors.push("Valid category Id is required.");
    }

    // Stock
    stock = Number(stock);
    if (isNaN(stock) || stock < 0) {
        errors.push("Valid stock quantity is required.");
    }

    return errors;
};
exports.validateId = (id) => {
    if (!id || id.toString().trim() === "" || isNaN(Number(id))) {
        return { message: "Valid Id is required" };
    }
    return null;
};