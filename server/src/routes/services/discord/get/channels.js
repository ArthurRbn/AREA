const { verifUserLinkDiscord, getChannels } = require('../utils');

const useChannels = async (req, res) => {
  try {
    let { type } = req.params;

    type = Number(type);

    // Verify if user is subscribe to discord

    const user = await verifUserLinkDiscord(req.userId);

    // Final verification to get the access token from discord

    let channels = await getChannels(user);

    // filter array got by discord api and add empty option

    channels = channels.filter((el) => el.type === type);
    channels = channels.map((el) => ({ name: el.name, value: el.id, type: 'string' }));

    // add option of inside no one

    if (type === 4) {
      channels.push({ name: 'root', value: '0', type: 'string' });
    }

    res.send(channels);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      status: false,
      error: 'internal get error',
    });
  }
};

module.exports = useChannels;
