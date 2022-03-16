const Actions = require('../../../actions');
const runInstance = require('../../instances/runInstance');
const Instance = require('../../../database/Instance');
const { User } = require('../../../database');

const webhook = async (req, res) => {
  try {
    let filter = { 'action.webhookId': req.headers['x-github-hook-id'] };

    if (req.headers['x-github-event'] === 'ping') {
      res.status(200).json({ status: true });
      return;
    }

    // Filters the createBranch action

    if (req.headers['x-github-event'] === 'create' && req.body.ref_type === 'tag') {
      res.status(200).json({ status: true });
      return;
    }

    // Filter the added pull_request_review action

    if (req.headers['x-github-event'] === 'pull_request_review') {
      if (req.body.action !== 'submitted') {
        res.status(200).json({ status: true });
        return;
      }

      const user = await User.findOne({ 'github.owner': req.body.pull_request.user.login });

      if (!user) {
        res.status(200).json({ status: true });
        return;
      }
      filter = { 'action.webhookId': req.headers['x-github-hook-id'], 'action.userId': user.id };
    }

    // Filter the added member action

    if (req.headers['x-github-event'] === 'member' && req.body.action !== 'added') {
      res.status(200).json({ status: true });
      return;
    }

    // filter for issues event

    if (req.headers['x-github-event'] === 'issues' && req.body.action !== 'opened') {
      res.status(200).json({ status: true });
      return;
    }

    // filter for star event

    if (req.headers['x-github-event'] === 'star' && req.body.action !== 'created') {
      res.status(200).json({ status: true });
      return;
    }

    // filter for pull request opened event

    if (req.headers['x-github-event'] === 'pull_request') {
      if (req.body.action === 'opened') {
        filter = { 'action.webhookId': req.headers['x-github-hook-id'], 'action.name': 'pullRequest' };
      } else if (req.body.action === 'review_requested') {
        const user = await User.findOne({ 'github.owner': req.body.requested_reviewer.login });

        if (!user) {
          res.status(200).json({ status: true });
          return;
        }
        filter = { 'action.webhookId': req.headers['x-github-hook-id'], 'action.name': 'reviewRequested' };
      } else {
        res.status(200).json({ status: true });
        return;
      }
    }

    const service = Actions.find((svc) => svc.name === 'github');
    const action = service.widgets.find(({ event }) => event === req.headers['x-github-event']);

    if (!action) {
      res.status(500).json({
        status: true,
        message: 'Event not yet implemented',
      });
      return;
    }

    // Get all instances linked to this webhook

    const webhookId = req.headers['x-github-hook-id'];
    const instances = await Instance.find(filter);

    if (!instances.length) {
      throw Error('instance not found');
    }

    // verification of the integrety of the webhook id
    await instances.forEach(async (instance) => {
      // const params = instance.action.params.reduce((a, b) => ({ ...a, [b.name]: b.value }), {});

      if (instance.action.webhookId.toString() !== webhookId) {
        throw Error('not your instance');
      }
    });

    await runInstance(instances);

    res.status(200).json({
      status: true,
      message: 'Webhook successfuly received',
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      status: false,
      error: 'internal endpoint error',
    });
  }
};

module.exports = webhook;
