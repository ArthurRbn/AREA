const path = require('path');

const metadata = {
  name: path.basename(__dirname),
  displayName: 'Create a post on your profile',
  description: 'A post will be added to your profile every time this reaction is trigerred',
  params: [
    {
      name: 'title',
      type: 'string',
      placeholder: 'title of the post',
    },
    {
      name: 'description',
      type: 'string',
      placeholder: 'description of the post',
    },
  ],
};

module.exports = metadata;
