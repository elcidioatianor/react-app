const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.post('/send', chatController.sendMessage);
router.get('/history/:otherId', chatController.getChatHistory);
router.get('/conversations', chatController.getConversations);

module.exports = router;
