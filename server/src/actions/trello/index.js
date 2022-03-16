const path = require('path');

const metadata = {
  name: path.basename(__dirname),
  displayName: 'Trello',
  description: 'Trello project management tool',
  needsOauth: true,
};

module.exports = metadata;