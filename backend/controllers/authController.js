const bcrypt = require("bcryptjs")
const { User } = require("../models/user")

module.exports = {
  async register(req, res) {
    try {
      const { username, password } = req.body

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
      res.status(500).json({ error: err.message })
    }
  },

  async login(req, res) {
    try {
      const { username, password } = req.body

      const user = await User.findOne({ where: { username } })
      if (!user) {
        return res.status(400).json({ error: "Usuário não encontrado" })
      }

      const ok = await bcrypt.compare(password, user.password)
      if (!ok) {
        return res.status(400).json({ error: "Senha incorreta" })
      }

      res.json({ message: "Login bem-sucedido" })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
}
