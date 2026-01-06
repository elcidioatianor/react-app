const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order');
const authMiddleware = require('../middleware/auth');

// All order routes require authentication
router.use(authMiddleware);

router.post('/', orderController.createOrder);
router.get('/my', orderController.getMyOrders);
router.get('/store', orderController.getStoreOrders);
router.patch('/:id/status', orderController.updateOrderStatus);

module.exports = router;
