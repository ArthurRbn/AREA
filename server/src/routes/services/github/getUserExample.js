const fetch = require('node-fetch');
const { User } = require('../../../database');

const userExample = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (user == null) {
      return res.json({
        status: false,
        error: 'User not found.',
      });
    }

    if (!user.github) {
      return res.json({
        status: false,
        error: 'User not register to github account.',
      });
    }

    const responseUser = await fetch('https://api.github.com/user', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.github.token}`,
      },
    });
    const dataUser = await responseUser.json();

    return res.send({
      status: true,
      dataUser,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: false,
      error: 'internal userExample error',
    });
  }
};

module.exports = userExample;
