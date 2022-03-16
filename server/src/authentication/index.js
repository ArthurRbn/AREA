const authMiddleware = require('./authMiddleware');
const emailAvailable = require('./emailAvailable');
const generateJwt = require('./generateJwt');
const hashPassword = require('./hashPassword');
const usernameAvailable = require('./usernameAvailable');
const verifyPassword = require('./verifyPassword');
const sendEmailVerification = require('./sendEmailVerification');
const githubAvailable = require('./githubAvailable');

module.exports = {
  authMiddleware,
  emailAvailable,
  generateJwt,
  hashPassword,
  usernameAvailable,
  verifyPassword,
  sendEmailVerification,
  githubAvailable,
};
