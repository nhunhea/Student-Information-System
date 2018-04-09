var express = require('express');
var router = express.Router();
//var flash = require('connect-flash');
//var path = require('path');
const moment = require('moment');

function gender(studentGender){
  if(studentGender === 'M'){
    return 'Male';
  } else {
    return 'Female';
  }
}

/* GET students page. */
router.get('/', function(req, res, next) {
  // Do the query to get data.
  req.getConnection(function(err, con) {
    if (err) return next(err);
    var studentList = [];
    
    con.query('SELECT * FROM students ORDER BY studentID DESC', function(err, rows, fields) {
      if (err) {
        console.log(err);
        res.status(500).json({"status_code": 500,"status_message": "internal server error"});
      } else {
        //console.log(rows);

        // Loop check on each row
        for (var i = 0; i < rows.length; i++) {

          // Create an object to save current row's data
          var student = {
            'studentID':rows[i].studentID,
            'name':rows[i].name,
            'address':rows[i].address,
            'gender':gender(rows[i].gender),
            'date_of_birth':moment(rows[i].date_of_birth).format('DD-MMM-YYYY'),
            'email':rows[i].email,
            'date_time':moment(rows[i].date_time).format('DD-MMM-YYYY')
          }
          // Add object into array
          studentList.push(student);
          //console.log(studentList);
        }
      // Render index.pug page using array 
      res.render('students', {title: 'Student List', data: studentList});
      }
    })
  })
});

router.get('/insert', function(req,res){
  res.render('insert', {title: 'Add Student'});
});

router.post('/insert',function(req,res){
  req.getConnection(function(err, con) {
    if (err) return next(err);
      var name = req.body.name;
      var address = req.body.address;
      var gender = req.body.gender;
      var date_of_birth = req.body.date_of_birth;
      var email = req.body.email;
  
      var sql = "INSERT INTO students (name, address, gender, date_of_birth, email) VALUES (?, ?, ?, ?, ?)";
      var values = [name, address, gender, date_of_birth, email];
      con.query(sql, values, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      res.redirect('/students');
      });
    })
 })

router.get('/edit', function(req,res){
  res.render('edit', {title: 'Edit Student'});
});

router.get('/:id', function(req, res) {
  req.getConnection(function(err, con) {
    if (err) return next(err);
    con.query('SELECT * FROM students WHERE studentID = ?', [req.params.id], function(err, rows, fields) {
      if(err) throw err
      //else console.log(rows);
      
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
              date_of_birth: moment(rows[0].date_of_birth).format('YYYY-MM-DD'),
              email:rows[0].email
          })
      }            
    })
  })
});

router.post('/edit',function(req,res){
  //var studentID = req.params.id;
  req.getConnection(function(err, con) {
    if (err) return next(err);
    var studentID=req.body.studentID;
    var name=req.body.name;
    var address=req.body.address;
    var gender=req.body.gender;
    var date_of_birth=req.body.date_of_birth;
    var email=req.body.email;

    var sql = "UPDATE students SET name=?, address=?, gender = ?, date_of_birth=?, email=? WHERE studentID=?";
    var values = [name, address, gender, date_of_birth, email, studentID];
    con.query(sql, values, function (err, result) {
      if (err) throw err;
      console.log("1 record updated");
      // console.log(studentID);
    res.redirect('/students');
    })
  })
});

router.post('/delete/:id', function(req,res){
  req.getConnection(function(err, con) {
    if (err) return next(err);
    var id = req.param("id");
    con.query('DELETE from students WHERE studentID = ?', [req.params.id], function(err, result) {
      if (err) throw err
      console.log(result);
      res.redirect('/students');
    })
  })
});

router.post('/search', function(req,res){
  req.getConnection(function(err, con) {
    if (err) return next(err);
    var studentList = [];
    var keyword = req.body.keyword;
    var opt = req.body.opt;
    var order = req.body.order;
    
    var sql = "SELECT * FROM students WHERE "+opt+" LIKE '%"+keyword+"%' ORDER BY "+opt+" "+order+"";
    //var sql = "SELECT * FROM students WHERE ? LIKE '%"+keyword+"%' ORDER BY "+opt+" "+order+"";
    //var sql = "SELECT * FROM students WHERE ? LIKE CONCAT('%',?,'%') ORDER BY ? ?";
    //var values = [opt, keyword, opt, order];
   
    // Do the query to get data.
    con.query(sql, function(err, rows, fields) {
      if (err) {
        res.status(500).json({"status_code": 500,"status_message": "internal server error"});
        console.log(err);
      } else {
        console.log(sql);

        // Loop check on each row
        for (var i = 0; i < rows.length; i++) {

          // Create an object to save current row's data
          var student = {
            'studentID':rows[i].studentID,
            'name':rows[i].name,
            'address':rows[i].address,
            'gender':gender(rows[i].gender),
            'date_of_birth':moment(rows[i].date_of_birth).format('DD-MMM-YYYY'),
            'email':rows[i].email,
            'date_time':moment(rows[i].date_time).format('DD-MMM-YYYY')
          }
          // Add object into array
          studentList.push(student);
      }
      console.log(studentList);
      // Render index.pug page using array 
      res.render('students', {title: 'Students List', data: studentList});
      }
    })
  })
});

module.exports = router;
