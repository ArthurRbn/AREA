const validator = require('email-validator');
const authentication = require('../../authentication');
const { User } = require('../../database');

const patch = async (req, res) => {
  let { username, password, email } = req.body;

  try {
    const user = await User.findById(req.userId);

    if (typeof username === 'string') {
      username = username.trim();
      if (username.length < 1) {
        res.status(400).json({
          status: false,
          error: 'username is empty',
        });
        return;
      }

      if (!(await authentication.usernameAvailable(username))) {
        res.json({
          status: false,
          error: 'username already taken',
        });
        return;
      }

      user.username = username;
    }

    if (typeof email === 'string') {
      email = email.trim();

      if (!validator.validate(email)) {
        res.status(400).json({
          status: false,
          error: 'email not valid',
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

      user.email = email;
    }

    if (typeof password === 'string') {
      password = password.trim();

      if (password.length < 4) {
        res.status(400).json({
          status: false,
          error: 'password is too short',
        });
        return;
      }

      user.password = await authentication.hashPassword(password);
    }

    await user.save();
    res.json({
      status: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      error: 'internal error',
    });
  }
};

module.exports = patch;
