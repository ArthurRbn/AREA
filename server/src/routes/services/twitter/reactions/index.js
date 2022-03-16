const postTweet = require('./postTweet');

const runReaction = {
  postTweet,
};

const twitterRunReaction = async (instance) => {
  await runReaction[instance.reaction.name](instance);
};

module.exports = twitterRunReaction;
