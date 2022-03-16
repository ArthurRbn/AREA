/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const { readdirSync } = require('fs');
const path = require('path');

const getDirectories = (source) => readdirSync(source, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

const loadDirectory = (dir) => (
  getDirectories(dir)
    .map((name) => require(path.join(dir, name)))
);

module.exports = loadDirectory;
