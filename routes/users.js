const express = require("express");
const router = express.Router();

//router.use(isAuthenticated);

/* GET users listing. */
router.get("/", function(req, res, next) {
  req.getConnection(function(err, con) {
    if (err) return next(err);
    var userList = [];

    // Do the query to get data.
    con.query("SELECT * FROM users ORDER BY userID DESC", function(err, rows, fields) {
      if (err) {
        res.status(500).json({ status_code: 500, status_message: "internal server error" });
      } else {
        //console.log(rows);

        // Loop check on each row
        for (var i = 0; i < rows.length; i++) {
          // Create an object to save current row's data
          var user = {
            userID: rows[i].userID,
            username: rows[i].username,
            password: rows[i].password,
            user_email: rows[i].user_email
            // 'date_time':formatDatem(rows[i].date_time)
          };
          // Add object into array
          userList.push(user);
        }
        res.render("users", { title: "User List", data: userList });
      }
    });
  });
});

router.get("/insert", function(req, res) {
  res.render("insert-user", { title: "Insert User" });
});

router.post("/insert", function(req, res) {
  // if (dobval == true ){
  req.getConnection(function(err, con) {
    if (err) return next(err);
    var username = req.body.username;
    var password = req.body.password;
    var user_email = req.body.user_email;

    //var sql = "INSERT INTO users (username, password, user_email) VALUES ('" + username + "', sha1('7fa73b47df808d36c5fe328546ddef8b9011b2c6" + password + "'),'" + user_email + "')";
    var sql1 = "SELECT username FROM users WHERE username = ?";
    var sql2 = "SELECT user_email FROM users WHERE user_email = ?";
    con.query(sql1, username, function(err, rows, fields) {
      if (err) throw err;
      if (rows.length > 0) {
        alert("Username already registered !");
        console.log("Username already registered !");
      } else {
        con.query(sql2, user_email, function(err, rows, fields) {
          if (err) throw err;
          if (rows.length > 0) {
            alert("Email already registered !");
            console.log("Email already registered !");
          } else {
            con.query(sql, function(err, res) {
              if (err) throw err;
              console.log("User : 1 record inserted");
            });
            res.redirect("/users");
          }
        });
      }
    });
  });
});

router.post("/search", function(req, res) {
  req.getConnection(function(err, con) {
    if (err) return next(err);
    var userList = [];
    var keyword = req.body.keyword;
    var opt = req.body.opt;
    var order = req.body.order;

    var sql = "SELECT * FROM users WHERE "+opt+" LIKE '%"+keyword+"%' ORDER BY userID "+order+"";
    //var sql = "SELECT * FROM users WHERE ? LIKE ? ORDER BY userID ?";
    //var values = [opt, keyword, opt, order];

    // Do the query to get data.
    con.query(sql, function(err, rows, fields) {
      if (err) {
        res.status(500).json({ status_code: 500, status_message: "internal server error" });
      } else {
        //console.log(rows);

        // Loop check on each row
        for (var i = 0; i < rows.length; i++) {
          // Create an object to save current row's data
          var user = {
            userID: rows[i].userID,
            username: rows[i].username,
            password: rows[i].password,
            user_email: rows[i].user_email
          };
          // Add object into array
          userList.push(user);
        }

        // Render index.pug page using array
        res.render("users", { title: "User List", data: userList });
      }
    });
  });
});

router.get("/edit", function(req, res) {
  res.render("edit-user", { title: "Edit Users" });
});

router.get("/:id", function(req, res) {
  req.getConnection(function(err, con) {
    if (err) return next(err);
    con.query("SELECT * FROM users WHERE userID = ?", [req.params.id], function(err, rows, fields) {
      if (err) throw err;
      else console.log(rows);

      // if user not found
      if (rows.length <= 0) {
        // req.flash('error', 'Student not found with id = ' + req.params.id)
        res.redirect("/users");
      } else {
        // if user found
        // render to views/index.pug template file
        res.render("edit-user", {
          title: "Edit User",
          userID: rows[0].userID,
          username: rows[0].username,
          password: rows[0].password,
          user_email: rows[0].user_email
        });
      }
    });
  });
});

router.post("/edit/:id", function(req, res) {
  //var studentID = req.params.id;
  req.getConnection(function(err, con) {
    if (err) return next(err);
    var userID = req.body.id;
    var username = req.body.username;
    var user_email = req.body.user_email;

    var sql = "UPDATE users SET user_email=? WHERE userID=?";
    var values = [user_email, userID];
    console.log(userID);
    con.query(sql, values, function(err, result) {
      if (err) throw err;
      console.log("1 record updated");
      console.log(user_email);
      console.log(userID);
      res.redirect("/users");
    });
  });
});

module.exports = router;
