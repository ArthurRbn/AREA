const path = require('path');

const metadata = {
  name: path.basename(__dirname),
  displayName: 'Card added to board',
  description: 'This trigger fires every time a card is added to a specific board.',
  event: 'action_create_card',
  params: [
    {
      name: 'board',
      type: 'get',
      route: '/services/trello/boards',
      placeholder: 'Please select',
    },
  ],
};

module.exports = metadata;
