var express = require('express');
var router = express.Router();
var passport = require('passport');


router.post('/', passport.authenticate('local', { successRedirect: '/students', failureRedirect: '/login', failureFlash: true }), function(req, res, info){
  res.render('login', {'message' :req.flash('message')});
});

router.get('/',function(req,res) {
  if (req.isAuthenticated ()){
    res.render('students');
  } else res.render('login', {'message' :req.flash('message')});
});

module.exports = router;
