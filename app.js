const express = require('express');
const path = require('path'); 
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

var flash = require('connect-flash');
var crypto = require('crypto');
var passport          = require('passport');
var LocalStrategy     = require('passport-local').Strategy;
// var connection        = require('./lib/dbconn');
var sess              = require('express-session');
var Store             = require('express-session').Store;
//var BetterMemoryStore = require(__dirname + '/memory');
var BetterMemoryStore = require('session-memory-store')(sess);

var app = express();

var mysql = require('mysql');
var myConnection  = require('express-myconnection');
var config = require('./config');
var dbOptions = {
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  //port: 	  config.database.port, 
  database: config.database.database
}
app.use(myConnection(mysql, dbOptions, 'pool'));


const index = require('./routes/index');
const users = require('./routes/users');
const students = require('./routes/students');
const stat = require('./routes/stat');
const login = require('./routes/login');
const forgot = require('./routes/forgot');
const reset = require('./routes/reset');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const store = new BetterMemoryStore({ expires: 60 * 60 * 1000, debug: true });

app.use(sess({
  name: 'JSESSION',
  secret: 'MYSECRETISVERYSECRET',
  store:  store,
  resave: true,
  saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use("local", new LocalStrategy({
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true //passback entire req to call back
    },
    function(req, username, password, done) {
      if (!username || !password) { 
        return done(null, false, req.flash("message", "All fields are required."));
      }
      req.getConnection(function(err, con) {
        if (err) return next(err);

      var salt = "7fa73b47df808d36c5fe328546ddef8b9011b2c6";
      
      
        con.query("select * from users where username = ?", [username], function(err, rows) {
         // console.log(err);
          console.log(rows);

          if (err) return done(req.flash("message", err));

          if (!rows.length) {
            return done(null, false, req.flash("message", "Invalid username or password."));
           }

          salt = salt + "" + password;
          var encPassword = crypto.createHash("sha1").update(salt).digest("hex");
          var dbPassword = rows[0].password;
          
          if (!(dbPassword == encPassword)) {
            return done(null,false,req.flash("message", "Invalid username or password."));
          }

          return done(null, rows[0]);
      });
    })
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.userID);
});

passport.deserializeUser(function(req, id, done) {
  req.getConnection(function(err, con) {
    if (err) return next(err);
    con.query("select * from users where userID = ?", id, function(err,rows) {
      done(err, rows[0]);
    })
  })
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/login');
});

app.use('/', index);
app.use('/login', login)
app.use('/stat', isAuthenticated, stat);
app.use('/students', isAuthenticated, students);
app.use('/users', isAuthenticated, users);
app.use('/forgot', forgot);
app.use('/reset', reset);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
