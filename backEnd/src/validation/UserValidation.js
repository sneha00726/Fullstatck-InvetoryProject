exports.validateUser = (name,email,password) => {
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
if (typeof password !== 'string' || password.length < 6) {
    errors.push("Password must be at least 6 characters long");
}
    return errors;
};
