const path = require('path');

const metadata = {
  name: path.basename(__dirname),
  displayName: 'Create a post on a subreddit',
  description: 'A post will be added to a subreddit every time this reaction is trigerred',
  params: [
    {
      name: 'subreddit',
      type: 'string',
      placeholder: 'subreddit name',
    },
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
