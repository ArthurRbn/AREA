const fetch = require('node-fetch');
const { verifUserLinkDiscord, getChannels } = require('../utils');

const createChannel = async (instance) => {
  // Get required informations

  const params = instance.reaction.params.reduce((a, c) => ({ ...a, [c.name]: c.value }), {});

  let channel = '';

  // Verify if user is subscribe to discord

  const user = await verifUserLinkDiscord(instance.userId);

  // Handle the fact no channel reference in the object

  if (Object.prototype.hasOwnProperty.call(params, 'channel')) {
    channel = params.channel;
  } else {
    // Code used only if the front cannot implement the get to back type parameter

    const channels = await getChannels(user);

    channel = channels.find((el) => el.type === 0);

    if (!channel) {
      throw Error(`No text channel in the guild ${user.guildName}`);
    }

    channel = channel.id;
  }

  // Execute the creation of the channel

  const response = await fetch(`https://discordapp.com/api/channels/${channel}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content: params.content }),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
    },
  });

  const data = await response.json();

  if (response.status >= 300) {
    console.error(data);
    throw Error(`An error appended when creating a message in ${user.guildName}`);
  }
};

module.exports = createChannel;
