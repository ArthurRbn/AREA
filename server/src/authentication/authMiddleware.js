const jsonwebtoken = require('jsonwebtoken');

const PREFIX = 'Bearer ';
const DEFAULT_SECRET = 'S3CR3T';

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization === undefined || !authorization.startsWith(PREFIX)) {
    res.status(401).json({
      error: 'unauthorized',
    });
    return;
  }

  const token = authorization.substring(PREFIX.length);
  const secret = process.env.SECRET || DEFAULT_SECRET;

  try {
    const payload = jsonwebtoken.verify(token, secret);
    req.username = payload.username;
    req.userId = payload.sub;
    next();
  } catch (err) {
    res.status(401).json({
      error: 'unauthorized',
    });
  }
};

module.exports = authMiddleware;
