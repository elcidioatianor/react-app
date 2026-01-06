const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User } = require('../database/models')
const error_codes = require('./errors')
const { AuthError } = error_codes;

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } //TODO: MOVER ISTO PARA O .env (15m)
  )
}

const generateRefreshToken = (user) => {
  return jwt.sign(
    { sub: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  )
}

const setRefreshToken = (res, refreshToken) => {
  const isProduction = process.env.NODE_ENV === 'production'

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'Lax',
    path: '/auth/refresh',
    maxAge: 7 * 24 * 60 * 60 * 1000
  })
}

const getAccessToken = (req) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    throw new Error('Token de acesso não fornecido')
  }

  const [, accessToken] = authHeader.split(' ');

  return accessToken;
}

// middleware requireAuth
exports.authenticate = (req, res, next) => {
  console.error('Verificando autenticação (%s)', req.path);
  try {
    //passport.authenticate('jwt', { session: false })(req, res, next);

    const accessToken = getAccessToken(req);
    if (!accessToken) {
      return res.status(401).json({ code: error_codes.ENOACCESS })
    }
    console.log('Verificando token...')
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    //APENAS ARMAZENAMOS ID & ROLE:
    //ID: BUSCAR USUÁRIO EM QUALQUER MIDDLEWARE SUBSEQUENTE QUE PRECISAR
    //ROLE: PERMITIR/RECUSAR ACESSO A RECURSOS EM MIDDLEWARES SUBSEQUENTES 
    req.payload = decoded // { sub, role }
    next()
  } catch (err) {
    console.log('Erro na verificação: ' + err.message)
    return res.status(401).json({ code: error_codes.EACCESS_EXPIRED }) //'Token inválido ou expirado'
  }
}

exports.register = async (req, res) => {
  const error = new AuthError(error_codes.EREGISTER)
  let status = 500;
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password) {//400 (Bad Request)
      error.code = error_codes.ENOCREDENTIALS;
      status = 400;

      throw error; //'Campos obrigatórios'
    }

    const exists = await User.findOne({
      where: { email }
    })

    if (exists) {//409: TODO: HANDLE THIS CORRECTLY (PROMPT USER TO RECOVER ITS PASSWORD)
      error.code = error_codes.EEXIST;
      status = 409;

      throw error; //'E-mail exists
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role
    })

    //LOGAR USUÁRIO IMEDIATAMENTE 
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    // Ideal: salvar HASH do refresh token
    user.refreshTokenHash = await bcrypt.hash(refreshToken, 10)
    user.lastLoginAt = new Date()
    user.isActive = true;

    await user.save()
    //Enviar refreshToken no header
    setRefreshToken(res, refreshToken)

    return res.status(201).json({//201
      message: 'Usuário criado com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      accessToken
    })
  } catch (err) {
    console.error(err)
    return res.status(status).json({ code: error.code })
  }
}

exports.login = async (req, res) => {
  const error = new AuthError(error_codes.ELOGIN)
  let status = 500;
  try {
    const { email, password } = req.body


    const user = await User.findOne({ where: { email } })

    if (!user) {//401
      error.code = error_codes.ENOEXIST;
      status = 401;

      throw error;
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {//401
      error.code = error_codes.EPASSWD_INCORRECT;
      status = 401;

      throw error;
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    // Ideal: salvar HASH do refresh token
    user.refreshTokenHash = await bcrypt.hash(refreshToken, 10)
    user.lastLoginAt = new Date()
    user.isActive = true;

    await user.save()

    setRefreshToken(res, refreshToken)
    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      accessToken,
      //refreshToken
    })
  } catch (err) {
    console.error(err)
    return res.status(status).json({ code: error.code })
  }
}

exports.refresh = async (req, res) => {//TODO: REFATORAR DEPOIS

  if (req.headers.origin !== 'http://localhost:5173') {
    return res.status(403).end()
  }

  const error = new AuthError(error_codes.EREFRESH)
  let status = 500;

  try {
    //const { refreshToken } = req.body

    const refreshToken = req.cookies.refreshToken;

    console.log('refresh: ' + refreshToken)

    if (!refreshToken) {
      error.code = error_codes.ENOREFRESH;
      status = 401;

      throw error;//'Refresh token ausente'
    }

    // 1️⃣ Verificar refresh token
    let payload;
    try {
      payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
      )
    } catch (err) {
      error.code = error_codes.EREFRESH_INVALID;
      status = 401;
      console.log('Erro ao verificar refresh: ' + err.message)
      throw error;//'Refresh token inválido ou expirado'
    }

    // 2️⃣ Buscar usuário
    const user = await User.findByPk(payload.sub)

    if (!user) {
      error.code = error_codes.ESESSION_INVALID;
      status = 401;
      console.log('Sessão inválida: usuário do token não encontrado')
      throw error; // 'Sessão inválida'
    }
    if (!user.refreshTokenHash) {
      error.code = error_codes.ESESSION_INVALID;
      status = 401;
      console.log('Sessão inválida: token hash não encontrado')
      throw error; // 'Sessão inválida'
    }

    try {
      // 3️⃣ Comparar hash do refresh token
      const isValid = await bcrypt.compare(
        refreshToken,
        user.refreshTokenHash
      )

      if (!isValid) {
        // Possível token reuse attack
        user.refreshTokenHash = null
        user.isActive = false;

        await user.save()
        error.code = error_codes.EREFRESH_INVALID;
        status = 401;
        console.error('Refresh token reutilizado ou comprometido')
        throw error; //'Refresh token reutilizado ou comprometido'
      }
    } catch (err) {
      console.error('Erro ao verificar refresh: ' + err.message)
    }
    // 4️⃣ Gerar novo access token
    const newAccessToken = generateAccessToken(user)

    // 5️⃣ (Opcional, recomendado) ROTATION do refresh token
    // ─────────────────────────────────────────────
    const newRefreshToken = generateRefreshToken(user)

    user.refreshTokenHash = await bcrypt.hash(newRefreshToken, 10)
    user.lastLoginAt = new Date();
    user.isActive = true;

    await user.save()

    setRefreshToken(res, newRefreshToken);
    console.log('new access token: ' + newAccessToken)
    return res.json({//200
      accessToken: newAccessToken,
      //refreshToken: newRefreshToken
    })

    // 6️⃣ Sem rotação (mais simples)
    //return res.json({
    //accessToken: newAccessToken
    //})

  } catch (err) {
    console.error('Refresh error: ' + err.code || err.message)
    //console.log(err)

    //Erro interno ao renovar sessão'
    return res.status(status).json({ code: err.code })
  }
}

exports.profile = async (req, res) => {
  try {
    let user = await User.findByPk(req.payload.sub);
    res.json(user);
  } catch (err) {
    console.error(err)
    res.status(500).json({
      code: error_codes.EINTERNAL //Erro ao carregar dados do usuário"
    })
  }
}

//Invalidar refresh token
exports.logout = async (req, res) => {
  try {
    let accessToken = getAccessToken(req);

    if (!accessToken) {
      return res.status(401).json({
        code: error_codes.ENOACCESS
      })//'Acess token não existe'
    }

    const user = await User.findByPk(req.user.sub)

    if (!user) {
      // idempotente → não revela estado
      return res.status(204).end()
    }

    // Invalida refresh token
    user.refreshTokenHash = null
    user.isActive = false;

    await user.save()

    res.clearCookie("refreshToken");
    res.clearCookie("csrfToken");

    //Não retornar mensagens tipo 'logout com sucesso'
    return res.status(204).end()
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      code: error_codes.ELOGOUT
    })
  }
}

exports.require_role = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Não autenticado' })
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acesso negado' })
    }

    next()
  }
}
