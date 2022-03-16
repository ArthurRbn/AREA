const path = require('path');

const metadata = {
  name: path.basename(__dirname),
  displayName: 'New pull request on repository',
  description: 'This trigger fires every time a pull request is open on the repository you specified',
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
