const Actions = require('../../../../actions');
const Instance = require('../../../../database/Instance');
const { getWebhook, deleteWebhook, addWebhook } = require('./requests');
const { verifUserLinkGithub } = require('../utils');

const updateGithubAction = async (userId, oldAction, newAction) => {
  // Find event to add

  const service = Actions.find((svc) => svc.name === newAction.serviceName);
  const action = service.widgets.find(({ name }) => name === newAction.name);

  // Transform parameters so its easier

  const newParams = newAction.params.reduce((acc, cur) => ({ ...acc, [cur.name]: cur.value }), {});
  const oldParams = oldAction.params.reduce((acc, cur) => ({ ...acc, [cur.name]: cur.value }), {});

  // Verify if user is subscribe to github

  const user = await verifUserLinkGithub(userId);

  // Delete old webhook only if no other instance need the webhook

  const instances = await Instance.find({ 'action.webhookId': oldAction.webhookId });

  if (instances.length < 2) {
    await deleteWebhook(user, oldParams.repository, oldAction.webhookId);
  }

  // Add new Webhook

  let webhook = await getWebhook(user, newParams.repository, action.event);

  if (!webhook) {
    webhook = await addWebhook(user, newParams.repository, action.event);
  }

  return webhook.id;
};

module.exports = updateGithubAction;
