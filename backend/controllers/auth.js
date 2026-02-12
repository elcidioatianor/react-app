const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { User } = require('../database/models');
const { ResponseError } = require('./error');

//Gerar token de acesso
const generateAccessToken = (user) => {
    return jwt.sign(
        {
            sub: user.id,
            role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: '15m' } //TODO: MOVER ISTO PARA O .env (15m)
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign({ sub: user.id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d',
    });
};

const setRefreshToken = (res, refreshToken) => {
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'Lax',
        path: '/auth/refresh',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

// middleware requireAuth
exports.authenticate = (req, res, next) => {
    try {
        //passport.authenticate('jwt', { session: false })(req, res, next);
        const authHeader = req.headers.authorization;
        const [, accessToken] = authHeader.split(' ');

        if (!accessToken) {
            return next(
                new ResponseError(400, 'Token de acesso não fornecido')
            );
        }
        console.log('Verificando token...');
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        //APENAS ARMAZENAMOS ID & ROLE:
        //ID: BUSCAR USUÁRIO EM QUALQUER MIDDLEWARE SUBSEQUENTE QUE PRECISAR
        //ROLE: PERMITIR/RECUSAR ACESSO A RECURSOS EM MIDDLEWARES SUBSEQUENTES
        req.payload = decoded; // { sub, role }
        next();
    } catch (err) {
        const error = new ResponseError(401, 'Token expirado ou inválido'); //'Token inválido ou expirado'

        error.code = 'EEXPIRY';
        next(error);
    }
};
//firstName, lastName, phoneNumber
exports.register = async (req, res, next) => {
    try {
        const { firstName, lastName, phoneNumber, email, password, role } =
            req.body;
        console.log(req.body)
        if (!firstName || !lastName || !phoneNumber || !email || !password) {
            //400 (Bad Request)
            return next(
                new ResponseError(
                    400,
                    'Credenciais não fornecidas ou incompletas'
                )
            );
        }

        const exists = await User.findOne({
            where: { phoneNumber },
        });

        if (exists) {
            //409: TODO: HANDLE THIS CORRECTLY (PROMPT USER TO RECOVER ITS PASSWORD)
            return next(
                new ResponseError(
                    409,
                    'O número de telefone fornecido já existe'
                )
            );
        }

        if (email) {
            const emailExists = await User.findOne({ where: { email } });
            if (emailExists) {
                return next(
                    new ResponseError(409, 'O e-mail fornecido já existe')
                );
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            phoneNumber,
            email: email || null,
            password: hashedPassword,
            role: role,
        });

        //LOGAR USUÁRIO IMEDIATAMENTE
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Ideal: salvar HASH do refresh token
        user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
        user.lastLoginAt = new Date();
        user.isActive = true;

        await user.save();
        //Enviar refreshToken no header
        setRefreshToken(res, refreshToken);

        return res.status(201).json({
            //201
            message: 'Usuário registado com sucesso',
            user: {
                //id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                email: user.email,
            },
            accessToken,
        });
    } catch (err) {
        console.error(err.message);
        next(new ResponseError(500, 'Erro interno no servidor'));
    }
};

exports.login = async (req, res, next) => {
    try {
        //TODO: CHANGE TO phoneNumber
        const { phoneNumber, password } = req.body;

        const user = await User.findOne({ where: { phoneNumber } });

        if (!user) {
            //401
            return next(new ResponseError(409, 'Número de telefone inválido'));
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            //401
            return next(new ResponseError(409, 'Senha incorrecta'));
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Ideal: salvar HASH do refresh token
        user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
        user.lastLoginAt = new Date();
        user.isActive = true;

        await user.save();

        setRefreshToken(res, refreshToken);
        return res.json({
            user: {
                //id: user.id,
                lastName: user.lastName,
                firstName: user.firstName,
                phoneNumber: user.phoneNumber,
                email: user.email,
                //role: user.role
            },
            accessToken,
            //refreshToken
        });
    } catch (err) {
        next(new ResponseError(500, 'Erro interno no servidor'));
    }
};

exports.forgotPassword = async (req, res, next) => {
    try {
        if (!req.body?.phoneNumber) {
            return next(
                new ResponseError(400, 'Número de telefone não fornecido')
            );
        }
        const { phoneNumber } = req.body;

        const user = await User.findOne({ where: { phoneNumber } });

        if (!user) {
            return next(new ResponseError(404, 'Número de telefone inválido'));
        }

        //TODO: SEND E-MAIL OR OTP TO PHONE,
        //THEN PROMPT USER TO ENTER RECEIVED CODE
        //IF VALID, PROMPT FOR NEW PASSWORD
        return res.json({
            message: 'Código de recuperação enviado',
            otpSent: true,
        });
    } catch (err) {
        next(new ResponseError(500, 'Erro interno no servidor'));
    }
};

exports.refresh = async (req, res, next) => {
    //TODO: REFATORAR DEPOIS

    if (req.headers.origin !== 'http://localhost:5173') {
        return res.status(403).end();
    }
    try {
        //const { refreshToken } = req.body

        const refreshToken = req.cookies.refreshToken;

        console.log('refresh: ' + refreshToken);

        if (!refreshToken) {
            return next(new ResponseError(401, 'Refresh token não fornecido'));
        }

        // 1️⃣ Verificar refresh token
        let payload;
        try {
            payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        } catch (err) {
            next(new ResponseError(400, 'Refresh token expirado ou inválido'));
        }

        // 2️⃣ Buscar usuário
        const user = await User.findByPk(payload.sub);

        if (!user) {
            return next(new ResponseError(400, 'Dados de sessão inválidos'));
        }

        if (!user.refreshTokenHash) {
            return next(new ResponseError(400, 'Dados de sessão inválidos'));
        }

        try {
            // 3️⃣ Comparar hash do refresh token
            const isValid = await bcrypt.compare(
                refreshToken,
                user.refreshTokenHash
            );

            if (!isValid) {
                // Possível token reuse attack
                user.refreshTokenHash = null;
                user.isActive = false;

                await user.save();
                return next(
                    new ResponseError(
                        401,
                        'Refresh token comprometido ou reutilizado'
                    )
                );
            }
        } catch (err) {
            return next(new ResponseError(500, 'Erro interno no servidor'));
        }

        // 4️⃣ Gerar novo access token
        const newAccessToken = generateAccessToken(user);

        // 5️⃣ (Opcional, recomendado) ROTATION do refresh token
        // ─────────────────────────────────────────────
        const newRefreshToken = generateRefreshToken(user);

        user.refreshTokenHash = await bcrypt.hash(newRefreshToken, 10);
        user.lastLoginAt = new Date();
        user.isActive = true;

        await user.save();

        setRefreshToken(res, newRefreshToken);
        return res.json({
            //200
            accessToken: newAccessToken,
            //refreshToken: newRefreshToken
        });

        // 6️⃣ Sem rotação (mais simples)
        //return res.json({
        //accessToken: newAccessToken
        //})
    } catch (err) {
        next(new ResponseError(500, 'Erro interno no servidor'));
    }
};

//TODO: MOVER PARA ./api
exports.profile = async (req, res, next) => {
    try {
        let user = await User.findByPk(req.payload.sub);
        res.json(user);
    } catch (err) {
        next(new ResponseError(500, 'Erro interno no servidor'));
    }
};

//Invalidar refresh token
exports.logout = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const [, accessToken] = authHeader.split(' ');

        if (!accessToken) {
            return next(
                new ResponseError(400, 'Token de acesso não fornecido')
            );
        }

        const user = await User.findByPk(req.user.sub);

        if (!user) {
            // idempotente → não revela estado
            return res.status(204).end();
        }

        // Invalida refresh token
        user.refreshTokenHash = null;
        user.isActive = false;

        await user.save();

        res.clearCookie('refreshToken');
        res.clearCookie('csrfToken');

        //Não retornar mensagens tipo 'logout com sucesso'
        return res.status(204).end();
    } catch (err) {
        next(new ResponseError(500, 'Erro interno no servidor'));
    }
};

exports.requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ResponseError(401, 'Usuário não autenticado'));
        }
        if (!allowedRoles.includes(req.user.role)) {
            return next(
                new ResponseError(403, 'Acesso não autorizado a este recurso')
            );
        }
        next();
    };
};

exports.authenticate = (req, res, next) => {
    return passport.authenticate('jwt', {
        session: false,
    })(req, res, next);
};
