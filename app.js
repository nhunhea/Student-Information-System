var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var flash = require('connect-flash');
var crypto = require('crypto');
var passport          = require('passport');
var LocalStrategy     = require('passport-local').Strategy;
// var connection        = require('./lib/dbconn');
var sess              = require('express-session');
var Store             = require('express-session').Store;
//var BetterMemoryStore = require(__dirname + '/memory');
var BetterMemoryStore = require('session-memory-store')(sess);
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
var mysql = require('mysql');
var alert = require('alert-node');
var async = require('async');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
var moment = require('moment');
moment().format();

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb"
});

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

//app.use('/', index);
app.use('/users', users);

var store = new BetterMemoryStore({ expires: 60 * 60 * 1000, debug: true });

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
);

passport.serializeUser(function(user, done) {
  done(null, user.userID);
});

passport.deserializeUser(function(id, done) {
  con.query("select * from users where userID = " + id, function(err,rows) {
    done(err, rows[0]);
  });
});

app.post('/login', passport.authenticate('local', { successRedirect: '/students', failureRedirect: '/', failureFlash: true }), function(req, res, info){
  res.render('index', {'message' :req.flash('message')});
});

app.get('/',function(req,res) {
  if (req.isAuthenticated ()){
    res.redirect('/students');
  } else res.render('login', {'message' :req.flash('message')});
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

var logout = require('express-passport-logout');
 
app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/');
});

function formatDatem(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [day, month, year].join('/');
}

function formatDatep(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

function gender(studentGender){
  if(studentGender === 'M'){
    return 'Male';
  } else {
    return 'Female';
  }
}

app.get('/students', isAuthenticated, function(req, res) {
  var studentList = [];

  // Do the query to get data.
  con.query('SELECT * FROM students ORDER BY studentID DESC', function(err, rows, fields) {
    if (err) {
      res.status(500).json({"status_code": 500,"status_message": "internal server error"});
    } else {
      console.log(rows);

      // Loop check on each row
      for (var i = 0; i < rows.length; i++) {

        // Create an object to save current row's data
        var student = {
          'studentID':rows[i].studentID,
          'name':rows[i].name,
          'address':rows[i].address,
          'gender':gender(rows[i].gender),
          'date_of_birth':formatDatem(rows[i].date_of_birth),
          'email':rows[i].email,
          'date_time':formatDatem(rows[i].date_time)
        }
        // Add object into array
        studentList.push(student);
      }
    // Render index.pug page using array 
    res.render('index', {title: 'Student List', data: studentList});
    }
  });
});

app.get('/students/insert', isAuthenticated, function(req,res){
  res.render('insert', {title: 'Add Student'});
});

function dobval (){
  var date_of_birth = req.body.date_of_birth;
  var today = formatDatep( new Date ());

  if (date_of_birth >= today){
    console.log("Data is invalid");
    return false;
  } else {
    return true;
  }
}

app.post('/students/insert',function(req,res){
 // if (dobval == true ){
    var name = req.body.name;
    var address = req.body.address;
    var gender = req.body.gender;
    var date_of_birth = req.body.date_of_birth;
    var email = req.body.email;

    var sql = "INSERT INTO students (name, address, gender, date_of_birth, email) VALUES ('"+name+"', '"+address+"','"+gender+"','"+date_of_birth+"','"+email+"')";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    res.redirect('/students');
    });
})

app.get('/users/insert',isAuthenticated, function(req,res){
  res.render('insert-user', {title: 'Insert User'});
});
app.post('/users/insert', isAuthenticated, function(req,res){
  // if (dobval == true ){
     var username = req.body.username;
     var password = req.body.password;
     var user_email = req.body.user_email;
 
     var sql = "INSERT INTO users (username, password, user_email) VALUES ('"+username+"', sha1('7fa73b47df808d36c5fe328546ddef8b9011b2c6"+password+"'),'"+user_email+"')";
     var sql1 = "SELECT username FROM users WHERE username = ?"
     var sql2 = "SELECT user_email FROM users WHERE user_email = ?";
     con.query(sql1, username, function(err, rows, fields) {
      if (err) throw err
      if(rows.length > 0) {
        alert('Username already registered !');
        console.log('Username already registered !');
			} else {
        con.query(sql2, user_email, function(err, rows, fields) {
          if (err) throw err
          if(rows.length > 0) {
            alert('Email already registered !');
            console.log('Email already registered !');
          } else {
            con.query(sql, function(err, res) {
              if (err) throw err;
              console.log("User : 1 record inserted");
             });
             res.redirect('/user_admin');
          }
        });
      }
    });
    
     /*con.query(sql, function (err, result) {
       if (err) throw err;
       console.log("User : 1 record inserted");
     res.redirect('/user_admin');
     });*/
   //} else {
    // console.log("Date is invalid");
    // res.render('insert');
  // }
 })
 app.get('/user_admin', isAuthenticated, function(req, res) {
  var userList = [];

  // Do the query to get data.
  con.query('SELECT * FROM users ORDER BY userID DESC', function(err, rows, fields) {
    if (err) {
      res.status(500).json({"status_code": 500,"status_message": "internal server error"});
    } else {
      console.log(rows);

      // Loop check on each row
      for (var i = 0; i < rows.length; i++) {

        // Create an object to save current row's data
        var user = {
          'userID':rows[i].userID,
          'username':rows[i].username,
          'password':rows[i].password,
          'user_email':rows[i].user_email
         // 'date_time':formatDatem(rows[i].date_time)
        }
        // Add object into array
        userList.push(user);
      }
    res.render('user-list', {title: 'User List', data: userList});
    }
  });
});

function dataAdapter(obj, cols){
  const chartData=[[...cols]]; //splat operator

  for (row in data){
    const temp = [];
    for (prop in cols){
      temp.push(prop);
    }
    chartData.push(temp);
  }
}

function adapter(x){
  var temp = [];
  for (var i=0; i<x.length; ++i){
    for (var j=0; j<x[i].length; ++j){
      if (x[i][j] === undefined) continue;
      if (temp[j] === undefined) temp [j] = [];
      temp[j][i] = x[i][j];
    }
  }
  return temp;
}
app.get('/students/stat/:year', isAuthenticated, function(req,res){
  var list = []; get_gender=[]; get_freq=[]; freq=[]; temp_freq=[]; get_month=[]; get_freqs=[]; freqs=[]; temp_freqs=[]; help2=[];
  
  var sql = 'select gender, count(gender) as freq from students GROUP BY gender;';
  var sql2 = 'SELECT month(date_time) as month, count(*) as freqs FROM students WHERE year(date_time)='+[req.params.year]+' group by month(date_time)';
  con.query(sql, function(err,rows,fields){
    if (err) {
      console.log (err)
    }
    else {
      get_gender.push('gender')
      get_freq.push('frequents')
      console.log(rows);
      for (var j=0; j<rows.length; j++){
        if (rows[j].gender === 'M') {
          get_gender.push('Male')
        } else {
          get_gender.push('Female')
        }
        get_freq.push(rows[j].freq)
      }
      temp_freq.push(get_gender, get_freq)  
      //console.log(get_freq);
    }
    var help = adapter(temp_freq); 
    console.log(help);

    //getdata for chart line
    con.query(sql2, function(err,rows,fields){
      //var rows = new Array(12);
      if (err) {
        console.log (err)
      }
      else {
        get_month.push('month', 'January', 'February', 'March', 'April', 'Mei', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
        get_freqs.push('frequents',0,0,0,0,0,0,0,0,0,0,0,0);
        console.log(rows);
        for(var i=0; i< rows.length; i++){
          var months = rows[i].month;
          //this is so soooooooooooo
          get_freqs.fill(rows[i].freqs, months, (months+1));
        }
      
        temp_freqs.push(get_month, get_freqs)
        console.log(get_freqs);
        console.log(get_month);
      }
      var help2 = adapter(temp_freqs); 
      console.log(help2);
      res.render('stat', {title: 'Statistics', data1: JSON.stringify(help), data2: JSON.stringify(help2)});
    })
  })
});

app.get('/students/edit', isAuthenticated, function(req,res){
  res.render('edit', {title: 'Edit Student'});
});

app.get('/students/:id', function(req, res) {
  con.query('SELECT * FROM students WHERE studentID = ?', [req.params.id], function(err, rows, fields) {
    if(err) throw err
    else console.log(rows);
		
		// if user not found
		if (rows.length <= 0) {
				// req.flash('error', 'Student not found with id = ' + req.params.id)
				res.redirect('/students')
		}
		else { // if user found
				// render to views/index.pug template file
				res.render('edit', {
            title: 'Edit Student', 
            studentID: rows[0].studentID,
						name: rows[0].name,
            address: rows[0].address,
            gender: rows[0].gender,
            date_of_birth: formatDatep(rows[0].date_of_birth),
            email:rows[0].email
        })
		}            
	});
});

app.post('/students/edit',function(req,res){
  //var studentID = req.params.id;
  var studentID=req.body.studentID;
  var name=req.body.name;
  var address=req.body.address;
  var gender=req.body.gender;
  var date_of_birth=req.body.date_of_birth;
  var email=req.body.email;

  var sql = "UPDATE students SET name=?, address=?, gender=?, date_of_birth=?, email=? WHERE studentID=?";
  var values = [name, address, gender, date_of_birth, email, studentID];
  con.query(sql, values, function (err, result) {
    if (err) throw err;
    console.log("1 record updated");
    // console.log(studentID);
  res.redirect('/students');
  });
});

app.post('/students/delete/:id', function(req,res){
  var id = req.param("id");
  var sql = "DELETE from students WHERE studentID=?";
  con.query(sql, [req.params.id], function(err, result) {
    if(err) throw err
    res.redirect('/students');
  });
});

app.post('/students/search', function(req,res){
  var studentList = [];
  var keyword = req.body.keyword;
  var opt = req.body.opt;
  var order = req.body.order;
  
  //if (keyword == null) var sql = "SELECT * FROM students WHERE "+opt+" LIKE '%"+keyword+"%' ORDER BY studentID DESC";
  //else 
  var sql = "SELECT * FROM students WHERE "+opt+" LIKE '%"+keyword+"%' ORDER BY "+opt+" "+order+"";
  //var sql = "SELECT * FROM students WHERE "+opt+" LIKE '%"+keyword+"%'";
  //var sql = "SELECT * FROM students WHERE name LIKE '%Ani%'";
  console.log(sql);

  // Do the query to get data.
  con.query(sql, function(err, rows, fields) {
    if (err) {
      res.status(500).json({"status_code": 500,"status_message": "internal server error"});
    } else {
      console.log(rows);

      // Loop check on each row
      for (var i = 0; i < rows.length; i++) {

        // Create an object to save current row's data
        var student = {
          'studentID':rows[i].studentID,
          'name':rows[i].name,
          'address':rows[i].address,
          'gender':gender(rows[i].gender),
          'date_of_birth':formatDatem(rows[i].date_of_birth),
          'email':rows[i].email,
          'date_time':formatDatem(rows[i].date_time)
        }
        // Add object into array
        studentList.push(student);
    }

    // Render index.pug page using array 
    res.render('index', {title: 'Students List', data: studentList});
    }
  });
});

app.get('/forgot', function(req,res){
  res.render('forgot', {title: 'Reset Email'});
});

app.post('/forgot', function(req, res, next) {
  var email=req.body.user_email;
  console.log(email);
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      console.log(token);
      con.query('select * from users where user_email=?', email, function(err, rows) {
        if (rows.length == 0) {
          req.flash('error', 'No account with that email address exists.');
          res.render('forgot', {'error': req.flash('error')})
          //return res.redirect('/forgot');
        }

        var resetToken = token;
        var resetExpires = moment().toDate();
        console.log(resetExpires);
        var reset = {token: resetToken, expired: resetExpires}

        if (rows.length > 0) {
          con.query("update users SET ? where user_email='"+email+"' ", [reset], function(err) {
            done(err, token, rows);
            console.log(rows);
          });
        }
        
      });
    },
    function(token, rows, done) {
      /*var smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'SendGrid',
        auth: {
          user: '!!! !!!',
          pass: '!!! YOUR SENDGRID PASSWORD !!!'
        }
      });*/
      //console.log(rows[0].user_email);
      if (rows.length > 0) {
        var mailOptions = {
        to: rows[0].user_email,
        from: 'passwordreset@demo.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
  
      sgMail.send(mailOptions, function(err) {
        req.flash('info', 'An e-mail has been sent to ' + rows[0].user_email + ' with further instructions.');
        
        done(err, 'done');
      });
      }
    }
  ], function(err) {
    if (err) return next(err);
    res.render('forgot', {'info': req.flash('info')})
    res.redirect('/forgot');
  });
});

app.get('/reset/:token', function(req, res) {
  con.query("select * from users where token='"+req.params.token+"' ", function(err, rows) {
    if (err) throw err

    if (rows.length<=0) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    console.log(rows[0].expired);
    var min = moment().diff(rows[0].expired, 'minute');
    console.log(min);
    if (min >= 15) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      alert('Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    var username = rows[0].username;
    var user_email = rows[0].user_email;
    res.render('reset', {
      username: username,
      user_email: user_email
    })
  });
});

app.post('/reset/:token', function(req, res, rows){
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.conpassword;
  var user_email = req.body.user_email;

  var sql = "UPDATE users SET password=sha1('7fa73b47df808d36c5fe328546ddef8b9011b2c6"+ password +"'), token=null, expired=null WHERE user_email=?";
  var values = [req.body.user_email]
  if (password === password2){
    con.query(sql, values, function (err, result) {
    if (err) err;
    console.log("Password changed record");
    alert('Password is changed');
    // console.log(studentID);
  //res.redirect('/');
  });

  var mailOptions = {
    to: user_email,
    from: 'passwordrchanged-noreply@demo.com',
    subject: 'Password Changed',
    text: 'Dear, '+ username +'.\n\n' +
      'As you requested, your password has now been reset. \n Your new details are as follows: \n' +
      'Username : ' + username + ' \n Email : ' + user_email + ' \n Password : ' + password + '\n\n' +
      'Thankyou. \n'
  };

  sgMail.send(mailOptions, function(err) {
    req.flash('info', 'Password Changed.');
    //done(err, 'done');
  });
  }
  else {
    //req.flash('notmatch', 'Password is not match');
    //res.render('reset', {'notmatch': req.flash('notmatch')})
    alert('Password is not match');
  }
  res.redirect('/');
});
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