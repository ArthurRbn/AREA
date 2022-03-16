const { User } = require('../database');

const emailAvailable = async (email) => {
  const u = await User.findOne({
    email,
  });
  return (u === null);
};

module.exports = emailAvailable;
