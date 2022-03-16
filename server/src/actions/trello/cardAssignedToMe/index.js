const path = require('path');

const metadata = {
  name: path.basename(__dirname),
  displayName: 'Card assigned to me',
  description: 'his Trigger fires every time a card is assigned to you.',
  event: 'action_member_joined_card',
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
