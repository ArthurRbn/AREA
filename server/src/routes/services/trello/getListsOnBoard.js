const fetch = require('node-fetch');
const { User } = require('../../../database');

const getListsOnBoard = async (req, res) => {
  const { idBoard } = req.body;

  if (idBoard == null || typeof idBoard !== 'string') {
    res.status(400).json({
      status: false,
      error: 'Bad request',
    });
  }

  const u = await User.findById(req.userId);

  if (u == null) {
    res.status(404).json({
      status: false,
      error: 'user not found',
    });
  }

  fetch(`https://trello.com/1/boards/${idBoard}/lists`, {
    headers: {
      Accept: 'application/json',
      Authorization: `OAuth oauth_consumer_key="${process.env.TRELLO_API_KEY}", oauth_token="${u.trello.trelloToken}"`,
    },
  })
    .then((response) => {
      if (response.status !== 200) {
        console.error('card not created');
      }
      return response.text();
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

      res.json({
        status: true,
        body: params,
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

module.exports = getListsOnBoard;
