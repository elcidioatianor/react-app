const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User } = require('../database/models')

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } //TODO: MOVER ISTO PARA O .env
  )
}

const generateRefreshToken = (user) => {
  return jwt.sign(
    { sub: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  )
}

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Campos obrigatórios' })
    }

    const exists = await User.findOne({
      where: { email }
    })

    if (exists) {
      return res.status(409).json({ message: 'Usuário já existe' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    })
	
	//LOGAR USUÁRIO IMEDIATAMENTE 
	const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    // Ideal: salvar HASH do refresh token
    user.refreshToken = await bcrypt.hash(refreshToken, 10)
    user.lastLoginAt = new Date()
    await user.save()

    return res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
		accessToken,
		refreshToken
    })
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao registrar' })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Endereço de e-mail inválido' })
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      return res.status(401).json({ message: 'A senha está incorrecta' })
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    // Ideal: salvar HASH do refresh token
    user.refreshToken = await bcrypt.hash(refreshToken, 10)
    user.lastLoginAt = new Date()
    await user.save()

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    })
  } catch (err) {
    return res.status(500).json({ message: 'Ocorreu um erro no servidor' })
  }
}
