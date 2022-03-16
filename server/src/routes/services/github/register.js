const fetch = require('node-fetch');
const { User } = require('../../../database');
const authentication = require('../../../authentication');

const register = async (req, res) => {
  try {
    const { code, state } = req.body;

    if (!code || !state || state !== process.env.GITHUB_STATE) {
      res.json({
        status: false,
        error: 'no code or state recieved from github service',
      });
      return;
    }

    // Final verification to get the access token from github

    const responseOauth = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    const dataOauth = await responseOauth.json();

    if (!dataOauth.access_token) {
      res.json({
        status: false,
        error: 'no access token get from github service',
      });
      return;
    }

    // Ask Github for login name

    const responseUser = await fetch('https://api.github.com/user', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${dataOauth.access_token}`,
      },
    });
    const dataUser = await responseUser.json();

    if (!dataUser.email) {
      const responseEmail = await fetch('https://api.github.com/user/emails', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${dataOauth.access_token}`,
        },
      });
      const dataEmail = await responseEmail.json();

      if (!dataEmail.length) {
        console.error('no email found');
      }
      const primaryUserEmail = dataEmail.find(({ primary }) => primary === true);

      if (!primaryUserEmail) {
        console.error('no email found 2');
      }

      dataUser.email = primaryUserEmail.email;
    }

    if (!dataUser.login) {
      res.json({
        status: false,
        error: 'no login owner get from github service',
      });
      return;
    }

    if (!(await authentication.usernameAvailable(dataUser.login))) {
      res.json({
        status: false,
        error: 'username already taken',
      });
      return;
    }

    if (!(await authentication.githubAvailable(dataUser.login))) {
      res.json({
        status: false,
        error: 'github already taken',
      });
      return;
    }

    if (!(await authentication.emailAvailable(dataUser.email))) {
      res.json({
        status: false,
        error: 'email already taken',
      });
      return;
    }

    // save token and name owner in github user object

    const user = new User({
      email: dataUser.email,
      username: dataUser.login,
      github: {
        token: dataOauth.access_token,
        owner: dataUser.login,
      },
    });

    await user.save();

    res.send({
      status: true,
      token: authentication.generateJwt(user),
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      status: false,
      error: 'internal register error',
    });
  }
};

module.exports = register;
