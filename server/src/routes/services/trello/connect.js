const OAuth = require('oauth');
const { User } = require('../../../database');

const connect = async (req, res) => {
  const oauthSecrets = {};
  const authorizeURL = 'https://trello.com/1/OAuthAuthorizeToken';
  const { callback } = req.body;
  const oauth = new OAuth.OAuth(
    'https://trello.com/1/OAuthGetRequestToken',
    'https://trello.com/1/OAuthGetAccessToken',
    process.env.TRELLO_API_KEY,
    process.env.TRELLO_API_SECRET,
    '1.0A', null, 'HMAC-SHA1',
  );

  if (callback == null || typeof callback !== 'string') {
    res.status(500).json({
      status: false,
      error: 'wrong parameters callback',
    });
    return;
  }

  try {
    oauth.getOAuthRequestToken(async (error, token, tokenSecret) => {
      if (error) {
        console.error(error);
        res.status(500).json({
          status: false,
          error: 'internal error',
        });
        return;
      }

      oauthSecrets[token] = tokenSecret;
      const redirectUrl = `${authorizeURL}?name=AREA&expiration=never&scope=read%2Cwrite&oauth_token=${token}&oauth_callback=${encodeURIComponent(callback)}`;

      const u = await User.findById(req.userId);

      if (u == null) {
        res.status(500).json({
          status: false,
          error: 'user not found',
        });
      }
      u.trello = {
        trelloToken: token,
        trelloTokenSecret: tokenSecret,
      };
      u.save();

      res.json({
        status: true,
        redirectUrl,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      error: 'internal error',
    });
  }
};

module.exports = connect;
