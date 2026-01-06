//const createError = require('http-errors');
const crypto = require('crypto')
const cors = require("cors");
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport')
const helmet = require('helmet')

//Rotas
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const storeRouter = require('./routes/stores');
const productRouter = require('./routes/products');
const orderRouter = require('./routes/orders');
const chatRouter = require('./routes/chat');

//App principal
const app = express();

// Passport
require('./config/passport')(passport)
app.use(passport.initialize())

//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'pug');

app.use(logger('dev'));

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
  credentials: true,
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-CSRF-Token'
  ],
  //exposedHeaders: [
  //'Content-Range'
  //],
  optionsSuccessStatus: 204
}));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      frameAncestors: ["'none'"]
    }
  }
}))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.options('*', cors()) //Allow OPTIONS method

//PROTECÇÃO CONTRA CSRF
app.use((req, res, next) => {
  isProduction = process.env.NODE_ENV === 'production';

  if (!req.cookies.csrfToken) {
    const token = crypto.randomBytes(32).toString('hex')

    res.cookie('csrfToken', token, {
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'Lax'
    })
  }

  next()
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/stores', storeRouter);
app.use('/products', productRouter);
app.use('/orders', orderRouter);
app.use('/chat', chatRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  //TODO: refatorar isto para retornar json
  res.status(404);
  res.json({
    error: '404 - Resource Not Found',
    code: 404
  });
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  console.log('app.js ---')
  console.error(err);

  res.json({
    error: err.message,
    code: err.status || 500,
    stack: req.app.get('env') === 'development' ? err.stack : ''
  });
});

module.exports = app;
