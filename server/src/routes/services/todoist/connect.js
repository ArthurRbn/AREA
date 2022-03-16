const clientId = process.env.TODOIST_ID;

const state = 'random_string';

const connect = async (req, res) => {
  try {
    if (!clientId) {
      return res.status(500).json({
        status: false,
        error: 'Todoist id token missing',
      });
    }
    const url = `https://todoist.com/oauth/authorize?client_id=${clientId}&scope=data:read_write&state=${state}`;
    const retObject = { url };
    return res.json(retObject);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: false,
      error: 'internal validate error',
    });
  }
};

module.exports = connect;
