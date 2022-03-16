const { User } = require('../../../database');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    const config = {
      headers: { 'User-Agent': 'school project', Authorization: `Bearer ${user.redditAccessToken}` },
    };

    const getProfileInfo = await fetch('https://oauth.reddit.com/api/v1/me', {
      method: 'GET',
      headers: config,
    });

    const dataUser = await getProfileInfo.json();

    return res.send({
      status: true,
      dataUser,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: false,
      error: 'internal validate error',
    });
  }
};

module.exports = getProfile;
