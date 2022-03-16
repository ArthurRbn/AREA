const fetch = require('node-fetch');
const { User } = require('../../../database');

const link = async (req, res) => {
  try {
    const { code, guildId, permissions } = req.body;

    if (!code || !guildId || !permissions) {
      res.json({
        status: false,
        error: 'no code, guild id or permissions recieved from discord service',
      });
      return;
    }

    if (permissions !== 8) {
      res.json({
        status: false,
        error: 'invalid permissions send to server',
      });
      return;
    }

    // Final verification to get the access token from discord

    const responseOauth = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: 'http://localhost:8081/discord/link',
      }),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const dataOauth = await responseOauth.json();

    if (!dataOauth.access_token || !dataOauth.guild || dataOauth.guild.id !== guildId) {
      res.json({
        status: false,
        error: 'no access token get from discord service',
      });
      return;
    }

    // save token and name owner in discord user object

    const user = await User.findById(req.userId);

    if (user == null) {
      res.json({
        status: false,
        error: 'User not found.',
      });
      return;
    }

    user.discord = {
      token: dataOauth.access_token,
      guildId: dataOauth.guild.id,
      guildName: dataOauth.guild.name,
      refreshToken: dataOauth.refresh_token,
      expireAt: (Date.now() / 1000 + dataOauth.expires_in).toString(),
    };

    await user.save();

    res.send({ status: true });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      status: false,
      error: 'internal link error',
    });
  }
};

module.exports = link;
