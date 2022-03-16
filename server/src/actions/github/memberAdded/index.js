const path = require('path');

const metadata = {
  name: path.basename(__dirname),
  displayName: 'New member in repository',
  description: 'This trigger fires every time an member is added in the repository you specified',
  event: 'member',
  params: [
    {
      name: 'repository',
      type: 'string',
      placeholder: 'repository name',
    },
  ],
};

module.exports = metadata;
