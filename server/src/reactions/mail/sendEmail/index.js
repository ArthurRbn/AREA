const path = require('path');

const metadata = {
  name: path.basename(__dirname),
  displayName: 'Send me an email',
  description: 'This trigger will send you an email.',
  params: [
    {
      name: 'subjects',
      type: 'string',
      placeholder: 'text...',
    },
    {
      name: 'body',
      type: 'string',
      placeholder: 'text...',
    },
  ],
};

module.exports = metadata;
