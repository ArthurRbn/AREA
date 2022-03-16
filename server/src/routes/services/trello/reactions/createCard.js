const fetch = require('node-fetch');
const User = require('../../../../database/User');

const createNewList = async (idBoard, name, u) => {
  const res = await fetch(`https://api.trello.com/1/boards/${idBoard}/lists?name=${name}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `OAuth oauth_consumer_key="${process.env.TRELLO_API_KEY}", oauth_token="${u.trello.trelloToken}"`,
    },
  })
    .then((response) => {
      if (response.status !== 200) {
        console.error(response.statusText);
        throw Error('List not created');
      }
      return response.text();
    })
    .then((body) => JSON.parse(body))
    .catch((err) => console.error(err));

  return res;
};

const getListsOnBoard = async (idBoard, u) => {
  const res = await fetch(`https://api.trello.com/1/boards/${idBoard}/lists`, {
    headers: {
      Accept: 'application/json',
      Authorization: `OAuth oauth_consumer_key="${process.env.TRELLO_API_KEY}", oauth_token="${u.trello.trelloToken}"`,
    },
  })
    .then((response) => {
      if (response.status !== 200) {
        throw Error('error while getting lists');
      }
      return response.text();
    })
    .then((body) => JSON.parse(body))
    .catch((err) => {
      console.error(err);
      throw Error(err);
    });

  return res;
};

const createCard = async (instance) => {
  const u = await User.findById(instance.userId);

  if (u == null) {
    throw Error('user not found');
  }
  const params = instance.reaction.params.reduce((acc, cur) => ({ ...acc, [cur.name]: cur.value }),
    {});

  const lists = await getListsOnBoard(params.board, u);

  const listToAdd = lists.find((x) => x.name === params.listName);

  let id = '';

  if (!listToAdd) {
    const newList = await createNewList(params.board, params.listName, u);
    id = newList.id;
  } else {
    id = listToAdd.id;
  }

  await fetch(`https://api.trello.com/1/cards?idList=${id}&name=${params.title.replace(' ', '+')}&desc=${params.description.replace(' ', '+')}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `OAuth oauth_consumer_key="${process.env.TRELLO_API_KEY}", oauth_token="${u.trello.trelloToken}"`,
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        console.error(response.statusText);
        throw Error('card not created');
      }
    })
    .catch((err) => {
      console.error(err);
      throw Error('card not created');
    });
};

module.exports = createCard;
