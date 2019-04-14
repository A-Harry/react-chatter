const express = require('express');
const router = express.Router();

const controller = require('../controllers/eventLog');

router.get('/', controller.get_all_events)

module.exports = router;