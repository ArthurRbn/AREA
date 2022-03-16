const redirectUri = 'http://localhost:8081/twitter/link';
const clientId = process.env.TWITTER_CLIENT_ID;

const connect = async (req, res) => {
  res.json({
    status: true,
    url: `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=tweet.write%20tweet.read%20users.read%20follows.read%20offline.access&state=Twitter&code_challenge=challenge&code_challenge_method=plain`,
  });
};

module.exports = connect;
