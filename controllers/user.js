const express = require("express");
const router = express.Router();

const SendMail = require("./../middlewares/sendmail");

const User = require("./../models/user");

// register get
router.get("/register", (req, res) => {
  res.render("register");
});

// register post
router.post("/register", (req, res) => {
  console.log(req.body);
  User.find({ email: req.body.email }).then(users => {
    if (users.length === 0) {
      let u1 = new User(req.body);

      u1.save().then(result => {
        console.log("User Addeded", result);
        // SendMail().then()
        req.flash("info", "User Registered Successfully");

        res.redirect("/user/login");
      });
    } else {
      req.flash("info", "Email Already Registered");
      res.redirect("/user/register");
    }
  });
});

// login get
router.get("/login", (req, res) => {
  res.render("login");
});

// login Post
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email, password: password }).then(result => {
    if (result) {
      req.session.email = email;
      req.flash("info", "Login Success");
      res.redirect("/");
    } else {
      req.flash("info", "Email or Password is Incorrect");
      res.redirect("/user/login");
    }
  });
});

// logout controller
router.get("/logout", (req, res) => {
  // delete req.session.email
  req.session.destroy(() => {
    res.redirect("/user/login");
  });
});

module.exports = router;
