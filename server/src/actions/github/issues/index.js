const path = require('path');

const metadata = {
  name: path.basename(__dirname),
  displayName: 'New issue on repository',
  description: 'This trigger fires every time an issue is created on the repository you specified',
  event: 'issues',
  params: [
    {
      name: 'repository',
      type: 'string',
      placeholder: 'repository name',
    },
  ],
};

module.exports = metadata;
