const path = require('path');

const metadata = {
  name: path.basename(__dirname),
  displayName: 'Pull request reviewed',
  description: 'This trigger fires every time your pull request is reviewed in the repository you specified',
  event: 'pull_request_review',
  params: [
    {
      name: 'repository',
      type: 'string',
      placeholder: 'repository name',
    },
  ],
};

module.exports = metadata;
