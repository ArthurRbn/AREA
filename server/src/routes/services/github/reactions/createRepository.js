/* eslint-disable max-len */
const fetch = require('node-fetch');
const { verifUserLinkGithub } = require('../utils');

const createRepository = async (instance) => {
  // Get required informations

  const params = instance.reaction.params.reduce((acc, cur) => ({ ...acc, [cur.name]: cur.value }), {});

  // Verify if user is subscribe to github

  const user = await verifUserLinkGithub(instance.userId);

  // Create issue with given parameters

  const responseCreate = await fetch('https://api.github.com/user/repos', {
    method: 'POST',
    body: JSON.stringify({
      name: params.name,
      description: params.description,
      private: params.private,
    }),
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${user.github.token}`,
    },
  });
  const dataCreate = await responseCreate.json();

  if (responseCreate.status >= 300) {
    console.error(dataCreate);
    throw Error('An error append when creating an repository.');
  }
};

module.exports = createRepository;
