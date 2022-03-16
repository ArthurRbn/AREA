const fetch = require('node-fetch');
const { User } = require('../../../database');

const refresh = async (userId) => {
  const u = await User.findById(userId);

  if (u == null) {
    throw Error('user not found');
  }

  const auth = Buffer.from(`${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`).toString('base64');

  const params = new URLSearchParams();
  params.append('refresh_token', u.twitterRefresh);
  params.append('grant_type', 'refresh_token');
  params.append('client_id', process.env.TWITTER_CLIENT_ID);
  params.append('client_secret', process.env.TWITTER_CLIENT_SECRET);

  const response = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${auth}`,
    },
    body: params.toString(),
  });

  const body = await response.json();

  u.twitterAccess = body.access_token;
  u.twitterRefresh = body.refresh_token;

  await u.save();
};

module.exports = refresh;
