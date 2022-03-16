const validator = require('email-validator');
const { v4 } = require('uuid');
const { User } = require('../../database');
const authentication = require('../../authentication');

const register = async (req, res) => {
  let { email, username, password } = req.body;

  if (typeof email !== 'string' || typeof username !== 'string' || typeof password !== 'string') {
    res.status(400).json({
      status: false,
      error: 'invalid body',
    });
    return;
  }

  email = email.trim();
  username = username.trim();
  password = password.trim();

  if (!validator.validate(email)) {
    res.status(400).json({
      status: false,
      error: 'email not valid',
    });
    return;
  }

  if (username.length < 1) {
    res.status(400).json({
      status: false,
      error: 'username is empty',
    });
    return;
  }

  if (password.length < 4) {
    res.status(400).json({
      status: false,
      error: 'password is too short',
    });
    return;
  }

  try {
    if (!(await authentication.usernameAvailable(username))) {
      res.json({
        status: false,
        error: 'username already taken',
      });
      return;
    }

    if (!(await authentication.emailAvailable(email))) {
      res.json({
        status: false,
        error: 'email already taken',
      });
      return;
    }

    const u = new User({
      email,
      username,
      password: await authentication.hashPassword(password),
      emailToken: v4(),
    });
    await u.save();
    await authentication.sendEmailVerification(u);

    res.json({
      status: true,
      error: 'please check your email for an email validation',
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
