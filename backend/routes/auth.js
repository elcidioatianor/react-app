const express = require('express');
const auth = require('../controllers/auth');
const csrfGuard = require('../controllers/csrf');

const router = express.Router();

router.post('/register', csrfGuard, auth.register);
router.post('/login', csrfGuard, auth.login);
router.post('/refresh', /*csrfGuard,*/ auth.refresh);
router.post('/logout', csrfGuard, auth.authenticate, auth.logout);

//TODO: MOVER PARA /api/user/*
router.post('/profile', csrfGuard, auth.authenticate, auth.profile);
router.post(
    '/api',
    csrfGuard,
    auth.authenticate,
    auth.requireRole('admin'),
    auth.profile
);

module.exports = router;
