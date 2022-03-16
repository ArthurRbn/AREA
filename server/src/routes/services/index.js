const express = require('express');
const { authMiddleware } = require('../../authentication');

const router = express.Router();

router.post('/github/webhook', require('./github/webhook'));
router.post('/trello/webhook', require('./trello/webhook').webhook);

router.get('/github/env', require('./github/env'));
router.post('/github/login', require('./github/login'));
router.post('/github/register', require('./github/register'));

router.use(authMiddleware);
router.get('/twitter/connect', require('./twitter/connect'));
router.post('/twitter/link', require('./twitter/link'));
router.get('/twitter/unlink', require('./twitter/unlink'));

router.post('/trello/connect', require('./trello/connect'));
router.post('/trello/link', require('./trello/link'));
router.get('/trello/getProfile', require('./trello/getProfile'));
router.get('/trello/unlink', require('./trello/unlink'));
router.get('/trello/boards', require('./trello/getBoardList'));
router.get('/trello/listsOnBoard', require('./trello/getListsOnBoard'));

router.post('/github/link', require('./github/link'));
router.get('/github/unlink', require('./github/unlink'));
router.get('/github/user', require('./github/getUserExample'));
router.get('/github/unlink', require('./github/unlink'));

router.get('/reddit/connect', require('./reddit/connect'));
router.post('/reddit/link', require('./reddit/link'));
router.get('/reddit/getProfile', require('./reddit/getProfile'));
router.get('/reddit/unlink', require('./reddit/unlink'));

router.post('/discord/link', require('./discord/link'));
router.get('/discord/unlink', require('./discord/unlink'));
router.get('/discord/env', require('./discord/env'));
router.get('/discord/get/channels/:type', require('./discord/get/channels'));

router.get('/todoist/connect', require('./todoist/connect'));
router.post('/todoist/link', require('./todoist/link'));
router.get('/todoist/unlink', require('./todoist/unlink'));
router.get('/todoist/get/projects', require('./todoist/get/getProjects'));
router.get('/todoist/get/tasks', require('./todoist/get/getTasks'));

module.exports = router;
