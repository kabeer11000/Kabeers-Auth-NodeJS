var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongo_uri = require('./keys/mongo_key');
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var cors = require('cors');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var userRouter = require('./routes/authorize');


var testRouter = require('./routes/test');
var apiRouter = require('./routes/api');
var authClientExampleRouter = require('./routes/auth_client_example');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: '3E144994E3E17F9B',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    url: mongo_uri
  })
}));
app.use(cors());
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
var router = express.Router();
router.get('/remove-account', (req, res) => {
  res.json('Hello')
});
/*
//Test Routes
app.use('/test', testRouter);
app.use('/api', apiRouter);
app.use('/example/auth', authClientExampleRouter);
app.use('/NANANA', testRouter);

*/
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
  res.json('error');
});

module.exports = app;
