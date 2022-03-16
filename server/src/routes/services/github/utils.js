const { User } = require('../../../database');

const verifUserLinkGithub = async (userId) => {
  // Delete weebhook link to a repository

  const user = await User.findById(userId);

  if (!user) {
    throw Error('User not found.');
  }

  if (!user.github) {
    throw Error('User not register to github account.');
  }

  return user;
};

module.exports = {
  verifUserLinkGithub,
};
