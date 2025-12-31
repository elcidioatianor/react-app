const express = require("express")
const auth = require("../controllers/auth")
const csrfGuard = require('../controllers/csrf')
const passport = require('passport')

const router = express.Router()

router.post("/register", csrfGuard, auth.register);
router.post("/login", csrfGuard, auth.login);
router.post("/refresh", /*csrfGuard,*/ auth.refresh);
router.post("/logout", csrfGuard, passport.authenticate('jwt', {session: false}), auth.logout);
router.post("/profile", csrfGuard,  passport.authenticate('jwt', {session: false}), auth.profile);
router.post("/api", csrfGuard,  passport.authenticate('jwt', {session: false}), auth.require_role('admin'), auth.profile);

module.exports = router
