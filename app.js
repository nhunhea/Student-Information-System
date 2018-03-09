var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

var mysql = require('mysql');

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

app.use('/', index);
app.use('/users', users);

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

app.get('/students', function(req, res) {
  var studentList = [];

  // Do the query to get data.
  con.query('SELECT * FROM students', function(err, rows, fields) {
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
          'date_of_birth':formatDatem(rows[i].date_of_birth)
        }
        // Add object into array
        studentList.push(student);
    }

    // Render index.pug page using array 
    res.render('index', {title: 'Student List', data: studentList});
    }
  });
});

app.get('/students/insert',function(req,res){
  res.render('insert');
});

app.post('/students/insert',function(req,res){
  var name=req.body.name;
  var address=req.body.address;
  var gender=req.body.gender;
  var date_of_birth=req.body.date_of_birth;

  //res.write('You sent the name "' + req.body.name+'".\n');

  //con.connect(function(err) {
  //if (err) throw err;
  var sql = "INSERT INTO students (name, address, gender, date_of_birth) VALUES ('"+name+"', '"+address+"','"+gender+"','"+date_of_birth+"')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    //res.end();
    //res.send('index');
  //});
  res.redirect('/students');
  });
})

app.get('/students/edit',function(req,res){
  res.render('edit');
});

app.get('/students/:id', function(req, res) {
  con.query('SELECT * FROM students WHERE studentID = ?', [req.params.id], function(err, rows, fields) {
    if(err) throw err
    else console.log(rows);
		
		// if user not found
		if (rows.length <= 0) {
				req.flash('error', 'Student not found with id = ' + req.params.id)
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

  var sql = "UPDATE students SET name=?, address=?, gender=?, date_of_birth=? WHERE studentID=?";
  var values = [name, address, gender, date_of_birth, studentID];
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
