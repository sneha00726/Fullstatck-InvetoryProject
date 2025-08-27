exports.validateCustomer = (name, email, phone_no, company_name, address, gstNumber) => {
    let errors = [];

    // Name
    if (!name || typeof name !== 'string' || name.trim() === '' || !isNaN(name)) {
        errors.push("Customer name is required and must be a valid string.");
    }

    // Email (simple logic: must contain '@' and '.')
    if (!email || typeof email !== 'string' || email.trim() === '') {
        errors.push("Email is required.");
    } else if (!email.includes('@') || !email.includes('.') || email.startsWith('@') || email.endsWith('@') || email.endsWith('.')) {
        errors.push("Email format is invalid.");
    }

    // Phone
    if (!phone_no || (typeof phone_no !== 'string' && typeof phone_no !== 'number')) {
        errors.push("Phone number is required and must be a string or number.");
    } else {
        phone_no = phone_no.toString().trim();
        if (phone_no.length !== 10 || !/^\d{10}$/.test(phone_no)) {
            errors.push("Phone number must be exactly 10 digits.");
        }
    }

    // Company name
    if (!company_name || typeof company_name !== 'string' || company_name.trim() === '') {
        errors.push("Company name is required and must be a string.");
    }

    // Address
    if (!address || typeof address !== 'string' || address.trim() === '') {
        errors.push("Address is required and must be a string.");
    }

    // GST number
    if (!gstNumber || typeof gstNumber !== 'string' || gstNumber.length !== 15) {
        errors.push("GST number is required and must be a 15-character string.");
    }

    return errors;
};
