const path = require('path');

const metadata = {
  name: path.basename(__dirname),
  displayName: 'Twitter',
  description: 'Twitter social network',
  needsOauth: true,
};

module.exports = metadata;
