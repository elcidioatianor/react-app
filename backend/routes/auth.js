const express = require("express")
const router = express.Router()
const auth = require("../controllers/auth")
const csrfGuard = require('../controllers/csrf')
const passport = require('passport')

router.post("/register", csrfGuard, auth.register);
router.post("/login", csrfGuard, auth.login);
router.post("/refresh", /*csrfGuard,*/ auth.refresh);
router.post("/logout", csrfGuard, passport.authenticate('jwt', {session: false}), auth.logout);
router.post("/profile"/*, csrfGuard*/,  passport.authenticate('jwt', {session: false}), auth.profile);

module.exports = router
