exports.validatePurchase = (invoiceno, purchasedate, supplierid, paymentmode, gstinvoice, items) => {
    let errors = [];

    if (!invoiceno || typeof invoiceno !== 'string') {
        errors.push("Invoice number is required and must be a string.");
    }

    if (!purchasedate || isNaN(Date.parse(purchasedate))) {
        errors.push("Valid purchase date is required.");
    }

    if (!supplierid || isNaN(Number(supplierid))) {
        errors.push("Supplier ID is required and must be a number.");
    }

    if (!paymentmode || !['cash', 'upi', 'card'].includes(paymentmode)) {
        errors.push("Payment mode is required and must be one of: cash, upi, card.");
    }

    if (!gstinvoice || typeof gstinvoice !== 'string') {
        errors.push("GST invoice is required and must be a string.");
    }

    if (!Array.isArray(items) || items.length === 0) {
        errors.push("At least one purchase item is required.");
    } else {
        items.forEach((item, index) => {
            if (!item.productid || isNaN(Number(item.productid))) {
                errors.push(`Item ${index + 1}: product ID is required and must be a number.`);
            }
            if (item.quantity === undefined || isNaN(Number(item.quantity)) || item.quantity <= 0) {
                errors.push(`Item ${index + 1}: quantity is required and must be a positive number.`);
            }
            if (item.price === undefined || isNaN(Number(item.price)) || item.price < 0) {
                errors.push(`Item ${index + 1}: price is required and must be a non-negative number.`);
            }
        });
    }

    return errors;
};
