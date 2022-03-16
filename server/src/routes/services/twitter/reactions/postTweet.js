const fetch = require('node-fetch');
const { User } = require('../../../../database');
const refresh = require('../refresh');

const postTweet = async (instance) => {
  await refresh(instance.userId);

  const u = await User.findById(instance.userId);
  if (u == null) {
    throw Error('user not found');
  }

  const params = instance.reaction.params.reduce((acc, cur) => ({ ...acc, [cur.name]: cur.value }),
    {});

  const res = await fetch('https://api.twitter.com/2/tweets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${u.twitterAccess}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: params.text,
    }),
  });

  await res.json();
};

module.exports = postTweet;
