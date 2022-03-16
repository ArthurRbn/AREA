const fetch = require('node-fetch');
const { verifUserLinkDiscord } = require('../utils');

const createChannel = async (instance) => {
  // Get required informations

  const params = instance.reaction.params.reduce((a, c) => ({ ...a, [c.name]: c.value }), {});

  // Verify if user is subscribe to discord

  const user = await verifUserLinkDiscord(instance.userId);

  // Create issue with given parameters
  const body = {
    name: params.name,
    topic: params.topic,
  };

  if (Object.prototype.hasOwnProperty.call(params, 'type')) {
    body.type = params.type;
  } else {
    body.type = 0;
  }

  if (Object.prototype.hasOwnProperty.call(params, 'place') && params.place !== '0') {
    body.parent_id = params.place;
  }

  // Execute the creation of the channel

  const response = await fetch(`https://discordapp.com/api/guilds/${user.discord.guildId}/channels`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
    },
  });
  const data = await response.json();

  if (response.status >= 300) {
    console.error(data);
    throw Error(`An error appended when creating an channel in ${user.guildName}`);
  }
};

module.exports = createChannel;
