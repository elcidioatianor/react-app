const csrfGuard = (req, res, next) => {
  const tokenCookie = req.cookies.csrfToken
  const tokenHeader = req.headers['x-csrf-token']
	
  if (!tokenCookie || tokenCookie !== tokenHeader) {
    return res.status(403).json({ message: 'Token CSRF inválido' })
  }

  next()
}

module.exports = csrfGuard;