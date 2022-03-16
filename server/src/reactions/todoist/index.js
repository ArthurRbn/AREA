const path = require('path');

const metadata = {
  name: path.basename(__dirname),
  displayName: 'Todoist',
  description: 'Todoist is a to-do list app',
  needsOauth: true,
};

module.exports = metadata;
