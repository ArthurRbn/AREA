const path = require('path');

const metadata = {
  name: path.basename(__dirname),
  displayName: 'Add a task to a project',
  description: 'A task will be added to a project every time this reaction is trigerred',
  params: [
    {
      name: 'project',
      type: 'get',
      route: '/services/todoist/get/projects',
      placeholder: 'project in which the task will be added',
    },
    {
      name: 'text',
      type: 'string',
      placeholder: 'text of task',
    },
  ],
};

module.exports = metadata;
