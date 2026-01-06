const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');
const passport = require('passport');

const authenticate = passport.authenticate('jwt', { session: false });

// Public routes
router.get('/', productController.getAllProducts);

// Protected routes
router.post('/', authenticate, productController.createProduct);
router.get('/my-products', authenticate, productController.getStoreProducts);
router.put('/:id', authenticate, productController.updateProduct);
router.delete('/:id', authenticate, productController.deleteProduct);

module.exports = router;
