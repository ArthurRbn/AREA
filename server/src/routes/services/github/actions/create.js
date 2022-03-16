const Actions = require('../../../../actions');
const { verifUserLinkGithub } = require('../utils');
const { getWebhook, addWebhook } = require('./requests');

const createGithubAction = async (userId, newAction) => {
  // Get required informations

  const service = Actions.find((svc) => svc.name === newAction.serviceName);
  const action = service.widgets.find(({ name }) => name === newAction.name);
  const params = newAction.params.reduce((acc, cur) => ({ ...acc, [cur.name]: cur.value }), {});

  // Verify if user is subscribe to github

  const user = await verifUserLinkGithub(userId);

  // search if webhook already exist

  let webhook = await getWebhook(user, params.repository, action.event);

  // create if it doesn't exist

  if (!webhook) {
    webhook = await addWebhook(user, params.repository, action.event);
  }

  return (webhook.id);
};

module.exports = createGithubAction;
