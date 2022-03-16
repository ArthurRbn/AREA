const { User } = require('../../../database');

const verifUserLinkReddit = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw Error('User not found.');
  }

  if (!user.redditAccessToken) {
    throw Error('User not register to reddit account.');
  }

  return user;
};

module.exports = {
  verifUserLinkReddit,
};
