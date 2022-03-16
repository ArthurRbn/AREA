const path = require('path');

const metadata = {
  name: path.basename(__dirname),
  displayName: 'New push on repository',
  description: 'This trigger fires every time a push is made on the repository you specified',
  event: 'push',
  params: [
    {
      name: 'repository',
      type: 'string',
      placeholder: 'repository name',
    },
  ],
};

module.exports = metadata;
