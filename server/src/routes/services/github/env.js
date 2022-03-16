const env = async (req, res) => {
  try {
    res.send({
      status: true,
      scope: 'repo,user,gist',
      clientId: process.env.GITHUB_CLIENT_ID,
      state: process.env.GITHUB_STATE,
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
