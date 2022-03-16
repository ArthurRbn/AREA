const path = require('path');

const metadata = {
  name: path.basename(__dirname),
  displayName: 'Discord',
  description: 'Discord is a VoIP, instant messaging and digital distribution platform.',
  needsOauth: true,
};

module.exports = metadata;
