const OAuth = require('oauth');
const { promisify } = require('util');
const { User } = require('../../../database');

const getProfileTest = async (req, res) => {
  const oauth = new OAuth.OAuth(
    'https://trello.com/1/OAuthGetRequestToken',
    'https://trello.com/1/OAuthGetAccessToken',
    process.env.TRELLO_API_KEY,
    process.env.TRELLO_API_SECRET,
    '1.0A', null, 'HMAC-SHA1',
  );

  const u = await User.findById(req.userId);

  if (u == null) {
    res.status(500).json({
      status: false,
      error: 'user not found',
    });
    return;
  }

  const getProfile = promisify(oauth.get.bind(oauth));

  try {
    let body = await getProfile('https://api.trello.com/1/members/me',
      u.trello.trelloToken,
      u.trello.trelloTokenSecret);

    body = JSON.parse(body);

    res.json({
      status: true,
      body,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      error: 'internal error',
    });
  }
};

module.exports = getProfileTest;
