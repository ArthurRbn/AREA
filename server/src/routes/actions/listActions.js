const actions = require('../../actions');

const listActions = async (req, res) => {
  const list = actions;

  res.json(list);
};

module.exports = listActions;
