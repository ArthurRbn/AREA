const fetch = require('node-fetch');
const crypto = require('crypto');
const { User } = require('../../../database');
const actions = require('../../../actions');
const Instance = require('../../../database/Instance');
const runInstance = require('../../instances/runInstance');

const verifyTrelloWebhookRequest = (request) => {
  const base64Digest = (s) => crypto.createHmac('sha1', process.env.TRELLO_API_SECRET).update(s).digest('base64');
  const content = JSON.stringify(request.body) + process.env.TRELLO_WEBHOOK;
  const doubleHash = base64Digest(content);
  const headerHash = request.headers['x-trello-webhook'];
  return doubleHash === headerHash;
};

const getAllToken = async (userId) => {
  const u = await User.findById(userId);
  const apiKey = process.env.TRELLO_API_KEY;

  if (u === null) {
    throw Error('user not found');
  }

  const val = await fetch(`https://api.trello.com/1/tokens/${u.trello.trelloToken}/webhooks`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `OAuth oauth_consumer_key="${apiKey}", oauth_token="${u.trello.trelloToken}"`,
    },
  })
    .then((response) => response.text())
    .then((response) => JSON.parse(response))
    .catch((err) => {
      console.error(err);
      throw Error(err);
    });

  return val;
};

const deleteWebhook = async (userId, id) => {
  const u = await User.findById(userId);
  const apiKey = process.env.TRELLO_API_KEY;

  if (u == null) {
    throw Error('user not found');
  }

  fetch(`https://api.trello.com/1/webhooks/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `OAuth oauth_consumer_key="${apiKey}", oauth_token="${u.trello.trelloToken}"`,
    },
  })
    .then((response) => {
      if (response.status !== 200) {
        console.error(response.statusText);
        throw Error(`${response.status} ${response.statusText}`);
      }
    })
    .catch((err) => console.error(err));
};

const create = async (userId, action) => {
  const apiKey = process.env.TRELLO_API_KEY;
  const u = await User.findById(userId);
  const callbackURL = process.env.TRELLO_WEBHOOK;
  const params = action.params.reduce((a, c) => ({ ...a, [c.name]: c.value }), {});
  let value = '';

  if (u == null) {
    throw Error('user not found');
  }

  await fetch(`https://api.trello.com/1/webhooks?callbackURL=${callbackURL}&idModel=${params.board}&description=${action.description}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `OAuth oauth_consumer_key="${apiKey}", oauth_token="${u.trello.trelloToken}"`,
    },
  })
    .then(async (response) => {
      if (response.status !== 200) {
        const res = await getAllToken(userId);

        const hook = res.find((x) => x.idModel === params.board);
        return { status: false, id: hook.id };
      }
      return response.text();
    })
    .then((body) => {
      if (body.status === false) {
        const { id } = body;
        value = id;
      } else {
        value = JSON.parse(body).id;
      }
    })
    .catch((err) => {
      console.error(err);
      throw Error(err);
    });

  return value;
};

const webhook = async (req, res) => {
  if (!verifyTrelloWebhookRequest(req)) {
    res.status(401).json({
      status: false,
      error: 'unauthorize',
    });
  }

  const service = actions.find((svc) => svc.name === 'trello');
  const action = service.widgets.find(({ event }) => event
  === req.body.action.display.translationKey);

  if (!action) {
    res.status(500).json({
      status: true,
      message: 'Event not yet implemented',
    });
    return;
  }

  const modelId = req.body.model.id;

  const instances = await Instance.find({ modelId });
  const finalInstances = [];

  instances.forEach((i) => {
    const params = i.action.params.reduce((a, c) => ({ ...a, [c.name]: c.value }), {});

    if ((params.board === modelId && action.name === i.action.name)) {
      finalInstances.push(i);
    }
    if (i.action.name === 'cardAddedToList') {
      if (params.list === req.body.action.data.list.id) {
        finalInstances.push(i);
      }
    }
  });

  if (!instances.length) {
    throw Error('instance not found');
  }

  await runInstance(finalInstances);

  res.status(200).json({
    status: true,
    message: 'Webhook successfuly received',
  });
};

const updateTrelloAction = async (userId, oldAction, newAction) => {
  const instances = await Instance.find({ 'action.webhookId': oldAction.webhookId });

  if (instances < 2) {
    await deleteWebhook(userId, instances.webhookId);
  }

  const id = create(userId, newAction);
  return id;
};

const deleteTrelloAction = async (userId, delAction) => {
  const instances = await Instance.find({ 'action.webhookId': delAction.webhookId });

  if (instances.length < 2) {
    await deleteWebhook(userId, delAction.webhookId);
  }
};

module.exports = {
  webhook, create, deleteWebhook, getAllToken, updateTrelloAction, deleteTrelloAction,
};
