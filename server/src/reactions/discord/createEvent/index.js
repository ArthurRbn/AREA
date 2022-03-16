const path = require('path');

const metadata = {
  name: path.basename(__dirname),
  displayName: 'Create an event',
  description: 'This trigger will create an event in a "server"',
  params: [
    {
      name: 'name',
      type: 'string',
      placeholder: 'Event name',
    },
    {
      name: 'description',
      type: 'string',
      placeholder: 'Event description',
    },
    {
      name: 'days',
      type: 'number',
      placeholder: 'trigger date + X days = event date',
    },
    {
      name: 'time',
      type: 'time',
      placeholder: 'Event start time',
      isOptional: true,
    },
    {
      name: 'channel',
      type: 'get',
      route: '/services/discord/get/channels/2',
      placeholder: 'channel in which the event will take place',
      isOptional: true,
    },
  ],
};

// Number of days after the action is triggered that the event is scheduled.
module.exports = metadata;
