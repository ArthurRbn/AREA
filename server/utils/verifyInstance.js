const servicesAction = require('../src/actions');
const servicesReactions = require('../src/reactions');

const validateType = (input, requestType) => {
  switch (requestType) {
    case 'number': return typeof input === 'number';
    case 'string': return typeof input === 'string';
    case 'boolean':
      if (input === 'true' || input === 'false') { return true; }
      return false;
    default: return false;
  }
};

const verifyAction = (action) => {
  if (typeof action !== 'object') { throw Error('wrong type on action'); }

  if (typeof action.name !== 'string'
      || typeof action.serviceName !== 'string'
      || typeof action.displayName !== 'string'
      || action.params === undefined) { throw Error('wrong member type of action widget'); }

  const serviceMetadata = servicesAction.find((svc) => svc.name === action.serviceName);
  if (serviceMetadata === undefined) { throw Error('action invalid service'); }

  const widgetMetadata = serviceMetadata.widgets.find((wdg) => wdg.name === action.name);
  if (widgetMetadata === undefined) { throw Error('action invalid widget'); }
};

const verifyReaction = (reaction) => {
  if (typeof reaction !== 'object') { throw Error('wrong type on reaction'); }
  if (typeof reaction.name !== 'string'
      || typeof reaction.serviceName !== 'string'
      || typeof reaction.displayName !== 'string'
      || reaction.params === undefined) { throw Error('wrong member type of reaction widget'); }

  const serviceMetadata = servicesReactions.find((svc) => svc.name === reaction.serviceName);
  if (serviceMetadata === undefined) { throw Error('reaction invalid service'); }

  const widgetMetadata = serviceMetadata.widgets.find((wdg) => wdg.name === reaction.name);
  if (widgetMetadata === undefined) { throw Error('reaction invalid widget'); }
};

module.exports = {
  verifyAction,
  verifyReaction,
};
