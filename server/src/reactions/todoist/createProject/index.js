const path = require('path');

const metadata = {
  name: path.basename(__dirname),
  displayName: 'Create a project',
  description: 'A project will be created every time this reaction is trigerred',
  params: [
    {
      name: 'title',
      type: 'string',
      placeholder: 'title of the project',
    },
  ],
};

module.exports = metadata;
