const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order');
const passport = require('passport');
const authenticate = passport.authenticate('jwt', { session: false });

// All order routes require authentication
router.use(authenticate);

router.post('/', orderController.createOrder);
router.get('/my', orderController.getMyOrders);
router.get('/store', orderController.getStoreOrders);
router.patch('/:id/status', orderController.updateOrderStatus);

module.exports = router;
