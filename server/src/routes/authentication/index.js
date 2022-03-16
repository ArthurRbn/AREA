const express = require('express');

const router = express.Router();
router.post('/register', require('./register'));
router.post('/login', require('./login'));
router.get('/verifyEmail/:token', require('./verifyEmail'));

module.exports = router;
