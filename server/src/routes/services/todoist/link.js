const fetch = require('node-fetch');
const { User } = require('../../../database');

const redirectUrl = 'http://localhost:8081/todoist/link';

const clientId = process.env.TODOIST_ID;

const clientSecret = process.env.TODOIST_SECRET;

const link = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const { token } = req.body;
    if (!token || token === '') {
      return res.json({
        status: false,
        error: 'no token received from todoist service',
      });
    }
    const details = {
      client_id: clientId,
      client_secret: clientSecret,
      code: token,
      redirect_uri: redirectUrl,
    };

    let formBody = [];
    Object.keys(details).forEach((k) => {
      const encodedKey = encodeURIComponent(k);
      const encodedValue = encodeURIComponent(details[k]);
      formBody.push(`${encodedKey}=${encodedValue}`);
    });
    formBody = formBody.join('&');

    const postToken = await fetch('https://todoist.com/oauth/access_token', {
      method: 'POST',
      body: formBody,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    });
    const dataOauth = await postToken.json();
    if (!dataOauth.access_token) {
      return res.json({
        status: false,
        error: 'no access token get from todoist service',
      });
    }
    user.todoistAccessToken = dataOauth.access_token;
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
