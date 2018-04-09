var express = require('express');
var router = express.Router();
//var flash = require('connect-flash');
//var path = require('path');
//const moment = require('moment');


function adapter(x) {
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

router.get('/:year', function(req,res){
  req.getConnection(function(err, con) {
    if (err) return next(err);
    var list = []; get_gender=[]; get_freq=[]; freq=[]; temp_freq=[]; get_month=[]; get_freqs=[]; freqs=[]; temp_freqs=[]; help2=[];
    
    var sql = 'select gender, count(gender) as freq from students GROUP BY gender;'
    //var sql2 = 'SELECT month(date_time) as month, count(*) as freqs FROM students WHERE year(date_time)='+[req.params.year]+' group by month(date_time)';
    var sql2 = 'SELECT month(date_time) as month, count(*) as freqs from students where year(date_time)=? group by month(date_time)'
    con.query(sql, function(err,rows,fields){
      if (err) {
        //console.log (err)
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
      con.query(sql2, [req.params.year], function(err,rows,fields){
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
        console.log(req.params.year);
        res.render('stat', {title: 'Statistics', data1: JSON.stringify(help), data2: JSON.stringify(help2)});
      })
    })
  })
});

module.exports = router;
