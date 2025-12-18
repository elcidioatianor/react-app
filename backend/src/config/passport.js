const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt')
const { User } = require('../database/models')

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, async (jwtPayload, done) => {
      try {
        const user = await User.findByPk(jwtPayload.sub)

        if (!user || !user.isActive) {
          return done(null, false)
        }

        return done(null, user)
      } catch (err) {
        return done(err, false)
      }
    })
  )
}
