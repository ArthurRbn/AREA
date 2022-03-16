const createChannel = require('./createChannel');
const createMessage = require('./createMessage');
const createEvent = require('./createEvent');

const runReaction = {
  createChannel,
  createMessage,
  createEvent,
};

const discordRunReaction = async (instance) => {
  await runReaction[instance.reaction.name](instance);
};

module.exports = discordRunReaction;
