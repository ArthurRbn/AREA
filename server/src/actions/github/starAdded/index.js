const path = require('path');

const metadata = {
  name: path.basename(__dirname),
  displayName: 'New star on repository',
  description: 'This trigger fires every time a star is added to the repository you specified',
  event: 'star',
  params: [
    {
      name: 'repository',
      type: 'string',
      placeholder: 'repository name',
    },
  ],
};

module.exports = metadata;
