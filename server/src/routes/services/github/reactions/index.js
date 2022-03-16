const createIssue = require('./createIssue');
const createRepository = require('./createRepository');
const createGist = require('./createGist');

const runReaction = {
  createIssue,
  createRepository,
  createGist,
};

const githubRunReaction = async (instance) => {
  await runReaction[instance.reaction.name](instance);
};

module.exports = githubRunReaction;
