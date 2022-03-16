const Instance = require('../../../../database/Instance');
const { verifUserLinkGithub } = require('../utils');
const { deleteWebhook } = require('./requests');

const deleteGithubAction = async (userId, delAction) => {
  // Get required informations

  const params = delAction.params.reduce((acc, cur) => ({ ...acc, [cur.name]: cur.value }), {});

  // Verify if user is subscribe to github

  const user = await verifUserLinkGithub(userId);

  // delete it only if no other instance required this webhook

  const instances = await Instance.find({ 'action.webhookId': delAction.webhookId });

  if (instances.length < 2) {
    await deleteWebhook(user, params.repository, delAction.webhookId);
  }
};

module.exports = deleteGithubAction;
