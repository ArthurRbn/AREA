const sendEmail = require('./send');

const runReaction = {
  sendEmail,
};

const mailRunreaction = async (instance) => {
  await runReaction[instance.reaction.name](instance);
};

module.exports = mailRunreaction;
