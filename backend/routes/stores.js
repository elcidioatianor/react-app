const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store');
const passport = require('passport');

const authenticate = passport.authenticate('jwt', { session: false });

router.post('/', authenticate, storeController.createStore);
router.get('/my-store', authenticate, storeController.getMyStore);
router.put('/', authenticate, storeController.updateStore);

module.exports = router;
