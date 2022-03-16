const env = async (req, res) => {
  try {
    res.send({
      status: true,
      clientId: process.env.DISCORD_CLIENT_ID,
      scope: 'identify%20bot%20applications.commands',
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      status: false,
      error: 'internal env error',
    });
  }
};

module.exports = env;
