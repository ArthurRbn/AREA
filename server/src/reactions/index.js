/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const path = require('path');
const loadDirectory = require('../../utils/loadDirectory');

module.exports = loadDirectory(__dirname).map((reaction) => ({
  ...reaction,
  widgets: loadDirectory(path.join(__dirname, reaction.name)).map((wid) => ({
    ...wid,
    params: [...wid.params],
  })),
}));
