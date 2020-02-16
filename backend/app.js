const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const db = require('./db.js');
const cors = require('cors');
const bodyParser = require('body-parser');
const testRouter = require('./api/routes/test')
const usersRouter = require('./api/routes/users');
const authRouter = require('./api/routes/auth');
// const rankRouter = require('./api/routes/rank');
// const problemsRouter = require('./api/routes/problems')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// connect DB
db();
app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/test', testRouter);
// app.use('/api/rank', rankRouter);
// app.use('/api/problems', problemsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
