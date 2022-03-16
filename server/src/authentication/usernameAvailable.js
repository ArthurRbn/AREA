const { User } = require('../database');

const usernameAvailable = async (username) => {
  const u = await User.findOne({
    username,
  });
  return (u === null);
};

module.exports = usernameAvailable;
