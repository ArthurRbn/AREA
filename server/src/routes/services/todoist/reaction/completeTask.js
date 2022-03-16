/* eslint-disable max-len */
const fetch = require('node-fetch');
const { verifUserLinkTodoist } = require('../utils');

const completeTask = async (instance) => {
  try {
  // Get required informations

    const params = instance.reaction.params.reduce((acc, cur) => ({ ...acc, [cur.name]: cur.value }), {});

    // Verify if user is subscribe to todoist

    const user = await verifUserLinkTodoist(instance.userId);

    const response = await fetch(`https://api.todoist.com/rest/v1/tasks/${params.task}/close`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user.todoistAccessToken}`,
      },
    });

    if (response.status >= 300) {
      throw Error('An error append when completing a task');
    }
  } catch (err) {
    console.error(err);

    throw Error('An internal error append');
  }
};

module.exports = completeTask;
