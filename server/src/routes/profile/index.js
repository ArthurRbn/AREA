const express = require('express');
const { authMiddleware } = require('../../authentication');

const router = express.Router();
router.use(authMiddleware);
router.get('/', require('./get'));
router.patch('/', require('./patch'));

module.exports = router;
