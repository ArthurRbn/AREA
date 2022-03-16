const path = require('path');

const metadata = {
  name: path.basename(__dirname),
  displayName: 'Reddit',
  description: 'Reddit is an American social news aggregation, web content rating, and discussion website.',
  needsOauth: true,
};

module.exports = metadata;
