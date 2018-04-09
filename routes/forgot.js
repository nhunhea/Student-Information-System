var express = require('express');
var router = express.Router();

var session = require('express-session')
var LocalStrategy = require('passport-local').Strategy;
//var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
var alert = require('alert-node');
var async = require('async');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
var moment = require('moment');
moment().format();

router.get('/', function(req,res){
  res.render('forgot', {title: 'Reset Password'});
});

router.post('/', function(req, res, next) {
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
      req.getConnection(function(err, con) {
        if (err) return next(err);
        con.query('select * from users where user_email=?', email, function(err, rows) {
          if (rows.length <= 0) {
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
        
      })
    })
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

module.exports = router;
