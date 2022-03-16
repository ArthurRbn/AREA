const path = require('path');

const metadata = {
  name: path.basename(__dirname),
  displayName: 'Review requested',
  description: 'This trigger fires every time a pull request review is assigned to you in the repository you specified',
  event: 'pull_request',
  params: [
    {
      name: 'repository',
      type: 'string',
      placeholder: 'repository name',
    },
  ],
};

module.exports = metadata;
