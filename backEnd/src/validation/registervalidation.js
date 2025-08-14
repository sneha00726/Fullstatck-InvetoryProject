
exports.validateEmail = function(email) {
    // Simple regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

//At least 6 characters

exports.validatePassword = function(password) {
    return typeof password === 'string' && password.length >= 6;
}
