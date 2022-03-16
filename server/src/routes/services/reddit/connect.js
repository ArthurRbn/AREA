const redirectUrl = 'http://localhost:8081/reddit/link';

const clientId = process.env.REDDIT_ID;

const state = 'random_string';

const connect = async (req, res) => {
  try {
    if (!clientId) {
      return res.status(500).json({
        status: false,
        error: 'Reddit id token missing',
      });
    }
    const url = `https://www.reddit.com/api/v1/authorize.compact?client_id=${clientId}&response_type=code&state=${state}&redirect_uri=${redirectUrl}&duration=permanent&scope=identity,submit`;
    const retObject = { url };
    return res.json(retObject);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: false,
      error: 'internal validate error',
    });
  }
};

module.exports = connect;
