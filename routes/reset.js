var express = require('express');
var router = express.Router();
var flash = require('connect-flash');
var alert = require('alert-node');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
var moment = require('moment');
moment().format();

router.get('/:token', function(req, res) {
  req.getConnection(function(err, con) {
    if (err) return next(err);
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
  })
});

router.post('/:token', function(req, res, rows){
  req.getConnection(function(err, con) {
    if (err) return next(err);
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
    
  res.redirect('/login');
  })
});

module.exports = router;
