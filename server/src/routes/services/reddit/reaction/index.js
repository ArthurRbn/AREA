const createPost = require('./createPost');
const createPostSub = require('./createPostSub');

const runReaction = {
  createPost,
  createPostSub,
};

const redditRunReaction = async (instance) => {
  await runReaction[instance.reaction.name](instance);
};

module.exports = redditRunReaction;
