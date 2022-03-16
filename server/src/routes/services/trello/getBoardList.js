const fetch = require('node-fetch');
const { User } = require('../../../database');

const getBoardList = async (req, res) => {
  const u = await User.findById(req.userId);

  if (u == null) {
    res.status(404).json({
      status: false,
      error: 'user not found',
    });
  }

  fetch('https://trello.com/1/members/me/boards?fields=name', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `OAuth oauth_consumer_key="${process.env.TRELLO_API_KEY}", oauth_token="${u.trello.trelloToken}"`,
    },
  })
    .then((text) => {
      if (text.status !== 200) {
        throw Error(`Bad request: ${text.status} ${text.statusText}`);
      }
      return text.text();
    })
    .then((body) => {
      const params = JSON.parse(body).map((val) => {
        const newVal = {
          name: val.name,
          value: val.id,
          type: 'string',
        };
        return newVal;
      });

      res.json(
        params,
      );
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ status: false, error: 'internal error' });
    });
};

module.exports = getBoardList;
