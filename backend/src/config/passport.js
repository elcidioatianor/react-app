const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt')
//const {sequelize} = require("../database/models/index")

let { User } = require('../database/models/index')//(sequelize);

module.exports = (passport) => {

    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET || 'CHAVE_SUPER_SECRETA'
    }

    passport.use(
        new JwtStrategy(opts, async (jwt_payload, done) => {
            try {
                const user = await User.findByPk(jwt_payload.id)

                if (user) return done(null, user)
                return done(null, false)

            } catch (err) {
                return done(err, false)
            }
        })
    )
}