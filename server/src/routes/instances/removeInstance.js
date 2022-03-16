const Instance = require('../../database/Instance');
const deleteGithubAction = require('../services/github/actions/delete');
const { deleteTrelloAction } = require('../services/trello/webhook');

const deleteAction = {
  github: deleteGithubAction,
  trello: deleteTrelloAction,
};

const removeInstance = async (req, res) => {
  const { id } = req.params;

  try {
    const instance = await Instance.findById(id);

    if (instance == null) {
      res.status(400).json({
        status: false,
        error: 'instance not found',
      });
      return;
    }
    if (instance.userId.toString() !== req.userId) {
      res.status(400).json({
        status: false,
        error: 'not your instance',
      });
      return;
    }

    await deleteAction[instance.action.serviceName](req.userId, instance.action);

    await instance.remove();

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

module.exports = removeInstance;
