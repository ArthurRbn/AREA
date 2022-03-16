const path = require('path');

const metadata = {
  name: path.basename(__dirname),
  displayName: 'Complete a task',
  description: 'A task will be completed when this reaction is trigerred',
  params: [
    {
      name: 'task',
      type: 'get',
      route: '/services/todoist/get/tasks',
      placeholder: 'task to be completed',
    },
  ],
};

module.exports = metadata;
