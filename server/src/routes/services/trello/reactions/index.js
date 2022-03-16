const createCard = require('./createCard');

const runReaction = {
  createCard,
};

const twitterRunReaction = async (instance) => {
  await runReaction[instance.reaction.name](instance);
};

module.exports = twitterRunReaction;
