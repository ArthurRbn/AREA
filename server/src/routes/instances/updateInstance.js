/* eslint-disable max-len */
const Instance = require('../../database/Instance');
const { verifyAction, verifyReaction } = require('../../../utils/verifyInstance');
const updateGithubAction = require('../services/github/actions/update');
const { updateTrelloAction } = require('../services/trello/webhook');

const updateAction = {
  github: updateGithubAction,
  trello: updateTrelloAction,
};

const updateInstance = async (req, res) => {
  const { id } = req.params;

  try {
    const instance = await Instance.findById(id);
    const { action, reaction } = req.body;

    if (instance === null) {
      res.status(400).json({
        status: false,
        error: 'instance not found',
      });
      return;
    }
    if (instance.userId !== req.userId) {
      res.status(400).json({
        status: false,
        error: 'not your instance',
      });
    }

    if (action != null) {
      // Do a deep copy of the action, any less disgusting alternative is welcome
      const oldAction = JSON.parse(JSON.stringify(instance.action));

      instance.action.params = action.params;
      verifyAction(instance.action);

      instance.action.webhookId = await updateAction[instance.action.serviceName](req.userId, oldAction, instance.action);
    }

    if (reaction != null) {
      instance.reaction.params = reaction.params;
      verifyReaction(instance.reaction);
    }

    await instance.save();

    res.json({
      status: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      error: 'internal error',
    });
  }
};

module.exports = updateInstance;
