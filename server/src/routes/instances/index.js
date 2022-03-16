const express = require('express');
const { authMiddleware } = require('../../authentication');

const router = express.Router();
router.use(authMiddleware);

router.post('/', require('./createInstance'));
router.get('/', require('./getListInstances'));
router.delete('/:id', require('./removeInstance'));
router.post('/:id', require('./updateInstance'));
router.delete('/delete/:service', require('./deleteInstances'));

module.exports = router;
