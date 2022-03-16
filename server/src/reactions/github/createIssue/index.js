const path = require('path');

const metadata = {
  name: path.basename(__dirname),
  displayName: 'Create a issue in a repository',
  description: 'An issue will be created every time this reaction is trigerred',
  params: [
    {
      name: 'repository',
      type: 'string',
      placeholder: 'repository name',
    },
    {
      name: 'title',
      type: 'string',
      placeholder: 'title of the issue',
    },
    {
      name: 'body',
      type: 'string',
      placeholder: 'body of the issue',
    },
  ],
};

module.exports = metadata;
