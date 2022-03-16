const path = require('path');

const metadata = {
  name: path.basename(__dirname),
  displayName: 'Post a tweet',
  description: 'This Action will post a Tweet',
  params: [
    {
      name: 'text',
      type: 'string',
      placeholder: 'Tweet...',
    },
  ],
};

module.exports = metadata;
