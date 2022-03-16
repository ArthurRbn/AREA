const fetch = require('node-fetch');
const { User } = require('../../../database');

const link = async (req, res) => {
  const u = await User.findById(req.userId);

  if (u == null) {
    res.status(404).json({
      status: false,
      error: 'user not found',
    });
  }

  const auth = Buffer.from(`${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`).toString('base64');

  const params = new URLSearchParams();

  params.append('code', req.body.code.toString());
  params.append('client_id', process.env.TWITTER_CLIENT_ID);
  params.append('redirect_uri', 'http://localhost:8081/twitter/link');
  params.append('state', req.body.state);
  params.append('grant_type', 'authorization_code');
  params.append('code_verifier', 'challenge');

  try {
    const result = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${auth}`,
      },
      body: params.toString(),
    });
    const body = await result.json();

    u.twitterAccess = body.access_token;
    u.twitterRefresh = body.refresh_token;

    u.save();

    res.json({
      status: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      error: 'internal error',
    });
  }
};

module.exports = link;
