const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')

const { User } = require('../database/models/index');

module.exports = {
  async register(req, res) {
    try {
      const { username, password } = req.body

	if (!username || !password) {
            return res.status(400).json({ error: 'Username e password são obrigatórios' })
        }

      const exists = await User.findOne({ where: { username } })
      if (exists) {
        return res.status(400).json({ error: "Usuário já existe" })
      }

      const hashed = await bcrypt.hash(password, 10)

      const user = await User.create({
        username,
        password: hashed
      })

      res.json({ message: "Usuário registrado", user })
    } catch (err) {
		res.status(500).json({
			error: err.message || "Erro interno" 
		})
    }
  },

  async login(req, res) {
    try {
      const { username, password } = req.body
		console.log(req.body)
      const user = await User.findOne({ where: { username } })
      if (!user) {
        return res.status(400).json({ error: "Usuário não encontrado" })
      }

      const ok = await bcrypt.compare(password, user.password)
      if (!ok) {
        return res.status(400).json({ error: "Senha incorreta" })
      }

      //res.json({ message: "Login bem-sucedido" })
		//Gerar payload e enviar ao frontend
	const payload = { id: user.id, username: user.username }

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'CHAVE_SUPER_SECRETA', {
            expiresIn: '1d'
        })

        return res.json({
            message: 'Login efetuado',
            token: 'Bearer ' + token
        })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
}
