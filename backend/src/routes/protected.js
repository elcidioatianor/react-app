const router = require('express').Router()
const passport = require('passport')

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
        res.json({
            message: 'Acesso autorizado',
            user: req.user
        })
    }
)

module.exports = router