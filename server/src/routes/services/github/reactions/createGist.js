/* eslint-disable max-len */
const fetch = require('node-fetch');
const { verifUserLinkGithub } = require('../utils');

const createGist = async (instance) => {
  // Get required informations

  const params = instance.reaction.params.reduce((acc, cur) => ({ ...acc, [cur.name]: cur.value }), {});

  // Verify if user is subscribe to github

  const user = await verifUserLinkGithub(instance.userId);

  // Create issue with given parameters

  const response = await fetch('https://api.github.com/gists', {
    method: 'POST',
    body: JSON.stringify({
      files: {
        [params.name]: {
          content: params.content,
        },
      },
      description: params.description,
      public: !params.private,
    }),
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${user.github.token}`,
    },
  });
  const data = await response.json();

  if (response.status >= 300) {
    console.error(data);
    throw Error('An error append when creating an Gist');
  }
};

module.exports = createGist;
