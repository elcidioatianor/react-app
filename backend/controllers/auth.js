const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
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

// Email service for password reset
const sendPasswordResetEmail = async (email, resetToken) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        const mailOptions = {
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: email,
            subject: 'Recuperação de Senha',
            html: `
                <h2>Recuperação de Senha</h2>
                <p>Clique no link abaixo para redefinir sua senha:</p>
                <a href="${resetLink}">${resetLink}</a>
                <p>Este link expira em 1 hora.</p>
                <p>Se você não solicitou isso, ignore este email.</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (err) {
        console.error('Erro ao enviar email:', err);
        return false;
    }
};


//firstName, lastName, phoneNumber
exports.register = async (req, res, next) => {
    try {
        const { firstName, lastName, phoneNumber, email, password, role } =
            req.body;
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
        console.log('=== LOGIN REQUEST ===');
        console.log('Method:', req.method);
        console.log('Content-Type:', req.headers['content-type']);
        console.log('Body:', req.body);
        console.log('Body keys:', Object.keys(req.body || {}));
        console.log('Body type:', typeof req.body);
        
        //TODO: CHANGE TO phoneNumber
        const { phoneNumber, password } = req.body;
        
        console.log('Extracted phoneNumber:', phoneNumber);
        console.log('Extracted password:', password ? '***' : 'MISSING');

        if (!phoneNumber || !password) {
            console.log('Missing required fields - phoneNumber:', !!phoneNumber, 'password:', !!password);
            return next(new ResponseError(400, 'Número de telefone e senha são obrigatórios'));
        }

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
                role: user.role
            },
            accessToken,
            //refreshToken
        });
    } catch (err) {
        console.error('Login error caught:', err);
        console.error('Error stack:', err.stack);
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
        console.log('Profile request - payload:', req.payload);
        console.log('Profile request - sub:', req.payload?.sub);
        console.log('Profile request - sub type:', typeof req.payload?.sub);

        if (!req.payload?.sub) {
            return next(new ResponseError(400, 'Token payload inválido'));
        }

        let user = await User.findByPk(req.payload.sub);
        console.log('User found:', user ? 'YES' : 'NO');
        console.log('User data:', user);

        if (!user) {
            return next(new ResponseError(404, 'Usuário não encontrado'));
        }

        res.json(user);
    } catch (err) {
        console.error('Profile error:', err);
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
    })(req, res, (err) => {
        if (err) return next(err);
        
        // Passport sets req.user to the User object
        // But auth.profile expects req.payload with sub property
        // So we need to bridge them
        if (req.user) {
            req.payload = {
                sub: req.user.id,
                role: req.user.role
            };
        }
        
        next();
    });
};

// Request password reset
exports.requestPasswordReset = async (req, res, next) => {
    try {
        const { phoneNumber, email } = req.body;

        if (!phoneNumber && !email) {
            return next(
                new ResponseError(400, 'Telefone ou email é obrigatório')
            );
        }

        const user = await User.findOne({
            where: phoneNumber ? { phoneNumber } : { email },
        });

        if (!user) {
            // Don't reveal if user exists
            return res.status(200).json({
                message:
                    'Se a conta existir, receberá um email com instruções',
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        // Send email
        const emailToSend = user.email || phoneNumber;
        const emailSent = await sendPasswordResetEmail(emailToSend, resetToken);

        if (!emailSent) {
            return next(new ResponseError(500, 'Erro ao enviar email'));
        }

        res.status(200).json({
            message: 'Email de recuperação enviado com sucesso',
        });
    } catch (err) {
        console.error(err);
        next(new ResponseError(500, 'Erro interno no servidor'));
    }
};

// Reset password with token
exports.resetPassword = async (req, res, next) => {
    try {
        const { resetToken, newPassword, confirmPassword } = req.body;

        if (!resetToken || !newPassword || !confirmPassword) {
            return next(
                new ResponseError(400, 'Todos os campos são obrigatórios')
            );
        }

        if (newPassword !== confirmPassword) {
            return next(new ResponseError(400, 'As senhas não conferem'));
        }

        if (newPassword.length < 6) {
            return next(
                new ResponseError(
                    400,
                    'A senha deve conter pelo menos 6 caracteres'
                )
            );
        }

        const user = await User.findOne({ where: { resetToken } });

        if (!user) {
            return next(new ResponseError(400, 'Token inválido ou expirado'));
        }

        if (new Date() > user.resetTokenExpiry) {
            user.resetToken = null;
            user.resetTokenExpiry = null;
            await user.save();
            return next(new ResponseError(400, 'Token expirado'));
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();

        res.status(200).json({
            message: 'Senha redefinida com sucesso',
        });
    } catch (err) {
        console.error(err);
        next(new ResponseError(500, 'Erro interno no servidor'));
    }
};
