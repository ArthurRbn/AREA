const { User } = require('../../../database');

const unlink = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (user == null) {
      res.json({
        status: false,
        error: 'User not found.',
      });
      return;
    }

    user.discord = {};

    await user.save();

    res.send({ status: true });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      status: false,
      error: 'internal validate error',
    });
  }
};

module.exports = unlink;
