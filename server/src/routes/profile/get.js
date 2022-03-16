const { User } = require('../../database');

const get = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    res.json({
      username: user.username,
      email: user.email,
      twitterLinked: user.twitterAccess != null,
      githubLinked: user.github.token != null,
      trelloLinked: user.trello.trelloToken != null,
      discordLinked: user.discord.token != null,
      redditLinked: user.redditAccessToken != null,
      todoistLinked: user.todoistAccessToken != null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      error: 'internal error',
    });
  }
};

module.exports = get;
