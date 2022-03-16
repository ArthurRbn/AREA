const express = require('express');

const router = express.Router();
router.get('/', require('./listReactions'));

module.exports = router;
