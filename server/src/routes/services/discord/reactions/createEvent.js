const fetch = require('node-fetch');
const { verifUserLinkDiscord, getChannels } = require('../utils');

const createEvent = async (instance) => {
  // Get required informations

  const params = instance.reaction.params.reduce((a, c) => ({ ...a, [c.name]: c.value }), {});

  // Verify if user is subscribe to discord

  const user = await verifUserLinkDiscord(instance.userId);

  // Create issue with given parameters
  const body = {
    name: params.name,
    description: params.description,
    privacy_level: 2,
    entity_type: 2,
    entity_metadata: null,
  };

  // Handle the time

  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let time = '';

  date.setDate(now.getDate() + Number(params.days));

  if (Object.prototype.hasOwnProperty.call(params, 'time')) {
    time = params.time;
  } else {
    time = '18:00';
  }

  time = time.split(':');

  date.setHours(time[0]);
  date.setMinutes(time[1]);

  // to utc + 1

  date.setHours(date.getHours() - 1);

  body.scheduled_start_time = date.toISOString();

  // Handle the fact no channel reference in the object

  if (Object.prototype.hasOwnProperty.call(params, 'channel')) {
    body.channel_id = params.channel;
  } else {
    // Code used only if the front cannot implement the get to back type parameter

    const channels = await getChannels(user);

    const channel = channels.find((el) => el.type === 2);

    if (!channel) {
      throw Error(`No text channel in the guild ${user.guildName}`);
    }

    body.channel_id = channel.id;
  }

  // Execute the creation of the channel

  const response = await fetch(`https://discordapp.com/api/guilds/${user.discord.guildId}/scheduled-events`, {
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
    throw Error(`An error appended when creating an event in ${user.guildName}`);
  }
};

module.exports = createEvent;
