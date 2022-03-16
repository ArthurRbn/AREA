const path = require('path');

const metadata = {
  name: path.basename(__dirname),
  displayName: 'New branch on repository',
  description: 'This trigger fires every time an branch is created on the repository you specified',
  event: 'create',
  params: [
    {
      name: 'repository',
      type: 'string',
      placeholder: 'repository name',
    },
  ],
};

module.exports = metadata;
