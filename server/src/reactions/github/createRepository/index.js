const path = require('path');

const metadata = {
  name: path.basename(__dirname),
  displayName: 'Create a repository',
  description: 'Create a repository in your personal organization',
  params: [
    {
      name: 'name',
      type: 'string',
      placeholder: 'name of the repository',
    },
    {
      name: 'description',
      type: 'string',
      placeholder: 'Description of the repository',
    },
    {
      name: 'private',
      type: 'boolean',
      placeholder: '',
    },
  ],
};

// https://docs.github.com/en/rest/reference/repos

module.exports = metadata;
