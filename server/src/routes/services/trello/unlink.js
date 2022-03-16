const { User } = require('../../../database');

const unlink = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (user == null) {
      return res.json({
        status: false,
        error: 'User not found.',
      });
    }

    user.trello.trelloToken = undefined;
    user.trello.trelloTokenSecret = undefined;

    await user.save();

    return res.send({ status: true });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: false,
      error: 'internal validate error',
    });
  }
};

module.exports = unlink;
