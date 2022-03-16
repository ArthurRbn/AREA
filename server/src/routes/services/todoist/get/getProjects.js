const fetch = require('node-fetch');
const { User } = require('../../../../database');

const getProjects = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      throw Error('User not found.');
    }

    if (!user.todoistAccessToken) {
      throw Error('User not register to todoist account.');
    }

    const request = await fetch('https://api.todoist.com/rest/v1/projects', {
      method: 'GET',
      headers: { Authorization: `Bearer ${user.todoistAccessToken}` },
    });
    const data = await request.json();

    let response = [];

    data.forEach((element) => {
      const info = { name: element.name, value: String(element.id), type: 'string' };
      response = response.concat(info);
    });

    return res.json(response);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: false,
      error: 'internal validate error',
    });
  }
};

module.exports = getProjects;
