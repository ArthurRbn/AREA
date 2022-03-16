const { User } = require('../../database');
const authentication = require('../../authentication');

const register = async (req, res) => {
  let { username, password } = req.body;

  if (typeof username !== 'string' || typeof password !== 'string') {
    res.status(400).json({
      status: false,
      error: 'invalid body',
    });
    return;
  }

  username = username.trim();
  password = password.trim();

  try {
    const u = await User.findOne({
      username,
    });
    if (u === null) {
      res.json({
        status: false,
        error: 'user not found',
      });
      return;
    }
    if (u.email !== undefined && u.emailToken !== undefined) {
      res.json({
        status: false,
        error: 'email not verified',
      });
      return;
    }

    if (!(await authentication.verifyPassword(u.password, password))) {
      res.json({
        status: false,
        error: 'incorrect password',
      });
      return;
    }

    res.json({
      status: true,
      token: authentication.generateJwt(u),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      error: 'internal error',
    });
  }
};

module.exports = register;
