const reactions = require('../../reactions');

const listReactions = async (req, res) => {
  const list = reactions;

  res.json(list);
};

module.exports = listReactions;
