
exports.validateEmail = function(email) {
    if (!email || typeof email !== 'string' || email.trim() === '') {
        errors.push("Email is required.");
    } else if (!email.includes('@') || !email.includes('.') || email.startsWith('@') || email.endsWith('@') || email.endsWith('.')) {
        errors.push("Email format is invalid.");
    }
}

//At least 6 characters

exports.validatePassword = function(password) {
    return typeof password === 'string' && password.length >= 6;
}
