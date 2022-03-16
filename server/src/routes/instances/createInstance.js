/* eslint-disable max-len */
const Instance = require('../../database/Instance');
const { verifyAction, verifyReaction } = require('../../../utils/verifyInstance');
const createGithubAction = require('../services/github/actions/create');
const trello = require('../services/trello/webhook');

const createAction = {
  github: createGithubAction,
  trello: trello.create,
  // twitter: createTwitterAction,
};

const createInstance = async (req, res) => {
  const { action, reaction } = req.body;
  const { userId } = req;

  try {
    const instance = new Instance({
      userId,
      action,
      reaction,
    });

    // essayer avec un nom indisponible
    instance.action.webhookId = await createAction[instance.action.serviceName](userId, instance.action);

    verifyAction(instance.action);
    verifyReaction(instance.reaction);

    await instance.save();
  } catch (err) {
    console.error(err);

    res.status(500).json({
      status: false,
      error: 'internal error',
    });
    return;
  }

  res.json({
    status: true,
  });
};

module.exports = createInstance;
