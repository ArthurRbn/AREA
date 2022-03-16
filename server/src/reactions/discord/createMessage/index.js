const path = require('path');

const metadata = {
  name: path.basename(__dirname),
  displayName: 'Create a message',
  description: 'This trigger will create a message in a channel',
  params: [
    {
      name: 'channel',
      type: 'get',
      route: '/services/discord/get/channels/0',
      placeholder: 'Choose a text channel send your message',
      isOptional: true,
    },
    {
      name: 'content',
      type: 'string',
      placeholder: 'Content of the message...',
    },
  ],
};

module.exports = metadata;
