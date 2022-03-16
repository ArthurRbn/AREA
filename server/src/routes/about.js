const actions = require('../actions');
const reactions = require('../reactions');

const about = (req, res) => {
  const act = actions.map((action) => ({
    name: action.name,
    action: action.widgets.map((widget) => ({
      name: widget.name,
      description: widget.description,
    })),
  }));

  const react = reactions.map((reaction) => ({
    name: reaction.name,
    reaction: reaction.widgets.map((widget) => ({
      name: widget.name,
      description: widget.description,
    })),
  }));

  const finalobj = [{
    name: 'discord',
    actions: act.filter((x) => x.name === 'discord').map((x) => x.action),
    reactions: react.filter((x) => x.name === 'discord').map((x) => x.reaction),
  },
  {
    name: 'github',
    actions: act.filter((x) => x.name === 'github').map((x) => x.action),
    reactions: react.filter((x) => x.name === 'github').map((x) => x.reaction),
  },
  {
    name: 'mail',
    actions: act.filter((x) => x.name === 'mail').map((x) => x.action),
    reactions: react.filter((x) => x.name === 'mail').map((x) => x.reaction),
  },
  {
    name: 'trello',
    actions: act.filter((x) => x.name === 'trello').map((x) => x.action),
    reactions: react.filter((x) => x.name === 'trello').map((x) => x.reaction),
  },
  {
    name: 'todoist',
    actions: act.filter((x) => x.name === 'todoist').map((x) => x.action),
    reactions: react.filter((x) => x.name === 'todoist').map((x) => x.reaction),
  },
  {
    name: 'twitter',
    actions: act.filter((x) => x.name === 'twitter').map((x) => x.action),
    reactions: react.filter((x) => x.name === 'twitter').map((x) => x.reaction),
  },
  {
    name: 'reddit',
    actions: act.filter((x) => x.name === 'reddit').map((x) => x.action),
    reactions: react.filter((x) => x.name === 'reddit').map((x) => x.reaction),
  },
  ];

  res.json({
    client: {
      host: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    },
    server: {
      currentTime: Math.floor(new Date().getTime() / 1000),
      services: finalobj,
    },
  });
};

module.exports = about;
