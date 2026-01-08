const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat');
const passport = require('passport');
const authenticate = passport.authenticate('jwt', { session: false });

router.use(authenticate);

router.post('/send', chatController.sendMessage);
router.get('/history/:otherId', chatController.getChatHistory);
router.get('/conversations', chatController.getConversations);

module.exports = router;
