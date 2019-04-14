const express = require('express');
const router = express.Router();

const controller = require('../controllers/chatroom');

router.get('/', controller.get_all_chatrooms)
router.get('/:chatroomId', controller.get_chatroom)
router.delete('/:chatroomId', controller.delete_chatroom)

module.exports = router;