/* eslint-disable max-len */
const fetch = require('node-fetch');
const { verifUserLinkReddit } = require('../utils');

const createPost = async (instance) => {
  try {
  // Get required informations

    const params = instance.reaction.params.reduce((acc, cur) => ({ ...acc, [cur.name]: cur.value }), {});

    // Verify if user is subscribe to reddit

    const user = await verifUserLinkReddit(instance.userId);

    const getProfileInfo = await fetch('https://oauth.reddit.com/api/v1/me', {
      method: 'GET',
      headers: {
        'User-Agent': 'school project',
        Authorization: `Bearer ${user.redditAccessToken}`,
      },
    });

    const dataUser = await getProfileInfo.json();

    const details = {
      title: params.title,
      text: params.description,
      sr: dataUser.subreddit.display_name,
      kind: 'self',
    };

    let formBody = [];
    Object.keys(details).forEach((k) => {
      const encodedKey = encodeURIComponent(k);
      const encodedValue = encodeURIComponent(details[k]);
      formBody.push(`${encodedKey}=${encodedValue}`);
    });
    formBody = formBody.join('&');

    const response = await fetch('https://oauth.reddit.com/api/submit', {
      method: 'POST',
      body: formBody,
      headers: {
        'User-Agent': 'school project',
        Authorization: `Bearer ${user.redditAccessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    });

    const data = await response.json();

    if (response.status >= 300) {
      console.error(data);
      throw Error('An error append when creating a post');
    }
  } catch (err) {
    console.error(err);

    throw Error('An internal error append');
  }
};

module.exports = createPost;
