const githubRunReaction = require('../services/github/reactions');
const discordRunReaction = require('../services/discord/reactions');
const todoistRunReaction = require('../services/todoist/reaction');
const redditRunReaction = require('../services/reddit/reaction');
const trelloRunReaction = require('../services/trello/reactions');
const mailRunReaction = require('../services/mail/reactions');
const twitterRunReaction = require('../services/twitter/reactions');

const runReaction = {
  github: githubRunReaction,
  discord: discordRunReaction,
  todoist: todoistRunReaction,
  reddit: redditRunReaction,
  trello: trelloRunReaction,
  mail: mailRunReaction,
  twitter: twitterRunReaction,
};

const runInstance = async (instances) => {
  // Distribute the reactions in the differents services

  await instances.forEach(async (instance) => {
    try {
      await runReaction[instance.reaction.serviceName](instance);
    } catch (err) {
      console.error(`An error append while executing this reaction: ${instance.reaction.name},\n\n ${err}`);
    }
  });
};

module.exports = runInstance;
