const router = require('express').Router();
const { authenticate } = require('../controllers/auth');

router.get('/profile', authenticate, (req, res) => {
	res.json({
    	message: 'Acesso autorizado',
        user: req.user,
    });
});

module.exports = router;
