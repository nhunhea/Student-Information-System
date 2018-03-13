var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

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
          'date_of_birth':formatDatem(rows[i].date_of_birth),
          'date_time':formatDatemg(rows[i].date_time)
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
app.get('/students/stat', function(req,res){
  var list = []; get_gender=[]; get_freq=[]; freq=[]; temp_freq=[]; get_month=[]; get_freqs=[]; freqs=[]; temp_freqs=[]; help2=[];
  
  var sql = 'select gender, count(gender) as freq from students GROUP BY gender;';
  var sql2 = 'SELECT month(date_time) as month, count(*) as freqs FROM students group by month(date_time)';
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
      if (err) {
        console.log (err)
      }
      else {
        get_month.push('month')
        get_freqs.push('frequents')
        console.log(rows);
        for (var j=0; j<rows.length; j++){
          if (rows[j].month === 1) {
            get_month.push('January')
          }
          else if (rows[j].month === 2) {
            get_month.push('February')
          }
          else if (rows[j].month === 3) {
            get_month.push('March')
          }
          else if (rows[j].month === 4) {
            get_month.push('April')
          }
          else if (rows[j].month === 5) {
            get_month.push('Mei')
          }
          else if (rows[j].month === 6) {
            get_month.push('June')
          }
          else if (rows[j].month === 7) {
            get_month.push('July')
          }
          else if (rows[j].month === 8) {
            get_month.push('August')
          }
          else if (rows[j].month === 9) {
            get_month.push('September')
          }
          else if (rows[j].month === 10) {
            get_month.push('October')
          }
          else if (rows[j].month === 11) {
            get_month.push('November')
          }
          else {
            get_month.push('December')
          }
          get_freqs.push(rows[j].freqs)
        }
        temp_freqs.push(get_month, get_freqs)  
        //console.log(get_freqs);
        //console.log(get_month);
      }
      var help2 = adapter(temp_freqs); 
      console.log(help2);
      res.render('stat', {title: 'Stats List', data1: JSON.stringify(help), data2: JSON.stringify(help2)});
    })
  })
  
  
 
    /*const chartData = [['gender', 'freq']];
    for (rows in list){
      chartData.push([gender, freq]);
    }
    return console.log(chartData);*/
  
  //const a = [{foo: 'bar'} ];res.render('stat', {test : JSON.stringify(a)});
});

app.get('/students/edit',function(req,res){
  res.render('edit');
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
            date_of_birth: formatDatep(rows[0].date_of_birth)
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

app.post('/students/search', function(req,res){
  var studentList = [];
  var keyword = req.body.keyword;
  var opt = req.body.opt;
  var order = req.body.order;
  
  if (keyword == null) var sql = "SELECT * FROM students WHERE "+opt+" LIKE '%"+keyword+"%' ORDER BY studentID DESC";
  else var sql = "SELECT * FROM students WHERE "+opt+" LIKE '%"+keyword+"%' ORDER BY "+opt+" "+order+"";
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
