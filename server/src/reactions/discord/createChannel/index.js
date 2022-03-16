const path = require('path');

const metadata = {
  name: path.basename(__dirname),
  displayName: 'Create a channel',
  description: 'This trigger will create a channel in a "server"',
  params: [
    {
      name: 'name',
      type: 'string',
      placeholder: 'channel name',
    },
    {
      name: 'type',
      type: 'dropdown',
      options: [{
        name: 'text channel',
        value: 0,
        type: 'number',
      }, {
        name: 'voice channel',
        value: 2,
        type: 'number',
      }, {
        name: 'category channel',
        value: 4,
        type: 'number',
      }],
      placeholder: 'channel type',
      isOptional: true,
    },
    {
      name: 'topic',
      type: 'string',
      placeholder: 'channel topic',
    },
    {
      name: 'place',
      type: 'get',
      route: '/services/discord/get/channels/4',
      placeholder: 'Choose a category channel to put in',
      isOptional: true,
    },
  ],
};

module.exports = metadata;
