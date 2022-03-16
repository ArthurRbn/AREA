/* eslint-disable max-len */
const fetch = require('node-fetch');

const getWebhook = async (user, repository, event) => {
  // Get weebhook link to a repository

  const responseList = await fetch(`https://api.github.com/repos/${user.github.owner}/${repository}/hooks`, {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${user.github.token}`,
    },
  });
  const dataList = await responseList.json();

  if (responseList.status >= 300) {
    console.error(dataList);
    throw Error(`An error append when getting a webhook from ${repository} repository.`);
  }

  const webhook = dataList.find(({ events }) => events.length === 1 && events[0] === event);

  if (!webhook) {
    return (null);
  }

  return (webhook);
};

const addWebhook = async (user, repository, event) => {
  // Add weebhook link to a repository

  const responseAdd = await fetch(`https://api.github.com/repos/${user.github.owner}/${repository}/hooks`, {
    method: 'POST',
    body: JSON.stringify({
      name: 'web',
      config: {
        url: process.env.GITHUB_WEBHOOK,
        content_type: 'json',
        secret: process.env.GITHUB_WEBHOOK_SECRET,
      },
      events: [event],
    }),
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${user.github.token}`,
    },
  });
  const dataAdd = await responseAdd.json();

  if (responseAdd.status >= 300) {
    console.error(dataAdd);
    throw Error(`An error append when adding a webhook to ${repository}.`);
  }

  return dataAdd;
};

const deleteWebhook = async (user, repository, webhookId) => {
  // Delete weebhook link to a repository

  const responseDelete = await fetch(`https://api.github.com/repos/${user.github.owner}/${repository}/hooks/${webhookId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${user.github.token}`,
    },
  });

  if (responseDelete.status >= 300) {
    throw Error(`An error append when deleting a webhook to ${repository}.`);
  }
};

module.exports = {
  getWebhook,
  addWebhook,
  deleteWebhook,
};
