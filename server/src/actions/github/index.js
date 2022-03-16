const path = require('path');

const metadata = {
  name: path.basename(__dirname),
  displayName: 'Github',
  description: 'Github is a provider of Internet hosting for software development and version control using Git',
  needsOauth: true,
};

module.exports = metadata;
