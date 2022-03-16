const bcrypt = require('bcrypt');

const verifyPassword = async (hash, password) => (bcrypt.compare(password, hash));

module.exports = verifyPassword;
