const jsonwebtoken = require('jsonwebtoken');

const DEFAULT_SECRET = 'S3CR3T';

const generateJwt = (user) => {
  const secret = process.env.SECRET || DEFAULT_SECRET;

  return (jsonwebtoken.sign({
    username: user.username,
  }, secret, {
    subject: user.id,
    expiresIn: '3 days',
  }));
};

module.exports = generateJwt;
