const createError = require('http-errors');
const cors = require("cors");
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport')

//Rotas
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
 
//App principal
const app = express();

// Passport
require('./config/passport')(passport)
app.use(passport.initialize())

//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/profile', profileRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    //TODO: refatorar isto para retornar json
    next(createError(404));
 });

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    //res.locals.message = err.message;
    //res.locals.error = req.app.get('env') === 'development'
    
    //TODO: ISTO TAMBEM
    //render the error page
    res.status(err.status || 500);
    res.json({
		error: error.message,
		code: err.status || 5000,
		stack: req.app.get('env') === 'development' ? error.stack : ''
	});
});

module.exports = app;
