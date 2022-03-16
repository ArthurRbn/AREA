/* eslint-disable max-len */
const fetch = require('node-fetch');
const { verifUserLinkTodoist } = require('../utils');

const createTask = async (instance) => {
  try {
  // Get required informations

    const params = instance.reaction.params.reduce((acc, cur) => ({ ...acc, [cur.name]: cur.value }), {});

    // Verify if user is subscribe to todoist

    const user = await verifUserLinkTodoist(instance.userId);

    const response = await fetch('https://api.todoist.com/rest/v1/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.todoistAccessToken}`,
      },
      body: JSON.stringify({
        Content: params.text,
        project_id: params.project,
      }),
    });

    const data = await response.json();

    if (response.status >= 300) {
      console.error(data);
      throw Error('An error append when creating a task');
    }
  } catch (err) {
    console.error(err);

    throw Error('An internal error append');
  }
};

module.exports = createTask;
