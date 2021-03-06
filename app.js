var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongo_uri = require('./keys/mongo_key');
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var cors = require('cors');
var compression = require('compression');
var helmet = require('helmet');
var back = require('express-back');
//var kauth = require('./routes/authSDK');
//var router = express.Router();


var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var userRouter = require('./routes/services/userinfo');
const frontEndApi = require("./routes/components/api/frontend/frontend");

var DriveRouter = require('./routes/components/kabeers_drive_example');
var DevelopersRouter = require('./routes/components/api/developers/developers');

//var testRouter = require('./routes/test');
//var apiRouter = require('./routes/api');
//var authClientExampleRouter = require('./routes/auth_client_example');
var retrive_user_activity = require('./routes/services/retrive_user_activity');

var app = express();
app.use(compression());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
//app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: '5s323720194bccb1cb94164a13E144994E3E17F9B',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        url: mongo_uri
    })
}));
app.use(cors({
    origin: (origin, callback) => callback(null, true),
    optionsSuccessStatus: 200,
    credentials: true
}));
app.use(back());
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/users/api', frontEndApi);

app.use('/devs/api', DevelopersRouter);
app.use('/activity', retrive_user_activity);
app.use('/test/drive', DriveRouter);
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

    if (!res.headersSent) {
        res.status(err.status || 500).json(err);
    }
});

module.exports = app;
