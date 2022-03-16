const path = require('path');

const metadata = {
  name: path.basename(__dirname),
  displayName: 'New fork on repository',
  description: 'This trigger fires every time a fork is maded from the repository you specified',
  event: 'fork',
  params: [
    {
      name: 'repository',
      type: 'string',
      placeholder: 'repository name',
    },
  ],
};

module.exports = metadata;
