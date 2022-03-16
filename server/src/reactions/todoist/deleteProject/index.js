const path = require('path');

const metadata = {
  name: path.basename(__dirname),
  displayName: 'Delete a project',
  description: 'A project will be deleted when this reaction is trigerred',
  params: [
    {
      name: 'project',
      type: 'get',
      route: '/services/todoist/get/projects',
      placeholder: 'project to be deleted',
    },
  ],
};

module.exports = metadata;
