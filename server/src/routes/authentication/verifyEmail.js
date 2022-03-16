const { User } = require('../../database');
const authentication = require('../../authentication');

const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const u = await User.findOne({
      emailToken: token,
    });
    if (u === null) {
      res.json({
        status: false,
        error: 'token not found',
      });
      return;
    }
    u.emailToken = undefined;
    await u.save();

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

module.exports = verifyEmail;
