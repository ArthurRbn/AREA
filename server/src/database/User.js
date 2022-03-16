const { Schema, model } = require('mongoose');

const TABLE_NAME = 'User';

const UserSchema = new Schema({
  username: String,
  password: String,
  email: String,
  emailToken: String,
  twitterAccess: String,
  twitterRefresh: String,
  github: {
    token: String,
    owner: String,
  },
  discord: {
    token: String,
    refreshToken: String,
    expireAt: String,
    guildId: String,
    guildName: String,
  },
  trello: {
    trelloToken: String,
    trelloTokenSecret: String,
    trelloId: String,
  },
  redditAccessToken: String,
  redditRefreshToken: String,
  todoistAccessToken: String,
});

const User = model(TABLE_NAME, UserSchema);

module.exports = User;
