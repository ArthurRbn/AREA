const bcrypt = require('bcrypt');

const ROUNDS = 12;

const hashPassword = async (password) => {
  const hash = await bcrypt.hash(password, ROUNDS);
  return hash;
};

module.exports = hashPassword;
