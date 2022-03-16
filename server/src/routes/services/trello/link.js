const OAuth = require('oauth');
const fetch = require('node-fetch');
const { User } = require('../../../database');

const link = async (req, res) => {
  const { oauthVerifier, oauthToken } = req.body;
  const oauth = new OAuth.OAuth(
    'https://trello.com/1/OAuthGetRequestToken',
    'https://trello.com/1/OAuthGetAccessToken',
    process.env.TRELLO_API_KEY,
    process.env.TRELLO_API_SECRET,
    '1.0A', null, 'HMAC-SHA1',
  );

  if (typeof oauthVerifier !== 'string' || oauthVerifier == null) {
    res.status(400).json({
      status: false,
      error: 'bad format for oauth verifier',
    });
    return;
  }
  if (typeof oauthToken !== 'string' || oauthToken == null) {
    res.status(400).json({
      status: false,
      error: 'bad format for oauth token',
    });
    return;
  }

  const u = await User.findById(req.userId);

  if (u == null) {
    res.status(500).json({
      status: false,
      error: 'user not found',
    });
    return;
  }

  try {
    oauth.getOAuthAccessToken(u.trello.trelloToken, u.trello.trelloTokenSecret, oauthVerifier,
      async (error, accessToken, accessTokenSecret) => {
        fetch('https://api.trello.com/1/members/me', {
          headers: {
            Accept: 'application/json',
            Authorization: `OAuth oauth_consumer_key="${process.env.TRELLO_API_KEY}", oauth_token="${accessToken}"`,
          },
        })
          .then((response) => response.text())
          .then(async (body) => {
            const jsonBody = JSON.parse(body);
            u.trello = {
              trelloToken: accessToken,
              trelloTokenSecret: accessTokenSecret,
              trelloId: jsonBody.id,
            };
            await u.save();
          })
          .catch((err) => console.error(err));
      });

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
