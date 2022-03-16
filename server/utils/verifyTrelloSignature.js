const crypto = require('crypto');

const verifyTrelloSignature = (req, trelloSecret, callbackUrl) => {
  const base64Digest = (s) => crypto.createHmac('sha1', trelloSecret).update(s).digest('base64');

  const content = JSON.stringify(req.body) + callbackUrl;
  const doubleHash = base64Digest(content);
  const headerHash = req.headers['x-trello-webhook'];

  return doubleHash === headerHash;
};

module.exports = verifyTrelloSignature;
