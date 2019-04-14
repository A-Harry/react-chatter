const express = require('express');
const router = express.Router();
const controller = require('../controllers/user');

router.get('/:userId', controller.get_user);
router.patch('/userId', controller.update_user);
router.get('/events/:name', controller.get_user_history)
router.get('/events/rooms/:roomName', controller.get_user_history_by_room)


module.exports = router;