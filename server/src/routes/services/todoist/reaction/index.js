const createTask = require('./createTask');
const createProject = require('./createProject');
const completeTask = require('./completeTask');
const deleteProject = require('./deleteProject');

const runReaction = {
  createTask,
  completeTask,
  createProject,
  deleteProject,
};

const todoistRunReaction = async (instance) => {
  await runReaction[instance.reaction.name](instance);
};

module.exports = todoistRunReaction;
