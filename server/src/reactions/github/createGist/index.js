const path = require('path');

const metadata = {
  name: path.basename(__dirname),
  displayName: 'Create a Gist in a repository',
  description: 'A Gist will be created every time this reaction is trigerred',
  params: [
    {
      name: 'name',
      type: 'string',
      placeholder: 'name of the Gist',
    },
    {
      name: 'content',
      type: 'string',
      placeholder: 'content of the Gist...',
    },
    {
      name: 'private',
      type: 'boolean',
      placeholder: '',
    },
  ],
};

module.exports = metadata;
