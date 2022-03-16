const fetch = require('node-fetch');
const { User } = require('../../../database');

const getToken = async (userId) => {
  // Retrieve user

  const user = await User.findById(userId);

  if (!user) {
    throw Error('User not found.');
  }

  if (!user.discord) {
    throw Error('User not registered to discord.');
  }

  if ((Date.now() / 1000) + 100 < Number(user.discord.expireAt)) {
    return user.discord.token;
  }

  const response = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: user.discord.refreshToken,
    }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  const data = await response.json();

  if (!data.access_token) {
    throw Error('Error append while refreshing the token');
  }

  user.discord = {
    token: data.access_token,
    refreshToken: data.refresh_token,
    expireAt: (Date.now() / 1000 + data.expires_in).toString(),
  };

  await user.save();

  return user.discord.token;
};

const verifUserLinkDiscord = async (userId) => {
  // Delete weebhook link to a repository

  const user = await User.findById(userId);

  if (!user) {
    throw Error('User not found.');
  }

  if (!user.discord) {
    throw Error('User not register to discord account.');
  }

  return user;
};

const getChannels = async (user) => {
  // get channel

  const response = await fetch(`https://discordapp.com/api/guilds/${user.discord.guildId}/channels`, {
    method: 'GET',
    headers: {
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
    },
  });

  const data = await response.json();

  if (response.status >= 300) {
    console.error(data);
    throw Error(`An error append when fetching channels in ${user.guildNname} guild`);
  }

  return data;
};

module.exports = {
  verifUserLinkDiscord,
  getToken,
  getChannels,
};
