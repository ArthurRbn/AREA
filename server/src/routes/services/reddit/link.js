const fetch = require('node-fetch');
const { User } = require('../../../database');

const redirectUrl = 'http://localhost:8081/reddit/link';

const clientId = process.env.REDDIT_ID;

const clientSecret = process.env.REDDIT_SECRET;

const link = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const { token } = req.body;
    if (!token || token === '') {
      return res.json({
        status: false,
        error: 'no token received from reddit service',
      });
    }
    const auth = `${clientId}:${clientSecret}`;
    const buff = Buffer.from(auth);
    const base64data = buff.toString('base64');
    const requestHeaders = new fetch.Headers();
    requestHeaders.set('User-Agent', 'school project');
    requestHeaders.set('Authorization', `Basic ${base64data}`);

    const bodyReq = new URLSearchParams();
    bodyReq.append('grant_type', 'authorization_code');
    bodyReq.append('code', token);
    bodyReq.append('redirect_uri', redirectUrl);
    const postToken = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      body: bodyReq,
      headers: requestHeaders,
    });
    const dataOauth = await postToken.json();
    if (!dataOauth.access_token) {
      return res.json({
        status: false,
        error: 'no access token get from reddit service',
      });
    }
    user.redditAccessToken = dataOauth.access_token;
    user.redditRefreshToken = dataOauth.refresh_token;
    user.save();
    return res.json({ status: true });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: false,
      error: 'internal validate error',
    });
  }
};

module.exports = link;
