const { User } = require('../../../database');

const verifUserLinkTodoist = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw Error('User not found.');
  }

  if (!user.todoistAccessToken) {
    throw Error('User not register to todoist account.');
  }

  return user;
};

module.exports = {
  verifUserLinkTodoist,
};
