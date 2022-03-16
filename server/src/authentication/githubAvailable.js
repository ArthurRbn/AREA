const { User } = require('../database');

const githubAvailable = async (owner) => {
  const u = await User.findOne({ 'github.owner': owner });
  return (u === null);
};

module.exports = githubAvailable;
