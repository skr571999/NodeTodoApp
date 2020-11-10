const express = require("express");
const router = express.Router();

const SendMail = require("./../middlewares/sendmail");

const User = require("./../models/user");

// to send register page
router.get("/register", (req, res) => {
  res.render("register", { user: "" });
});

// to add new user
router.post("/register", (req, res) => {
  // console.log(req.body);
  const { email, password, name } = req.body;
  if (name && email && password) {
    User.find({ email }).then((users) => {
      if (users.length === 0) {
        User.create({ email, password, name })
          .then((result) => {
            // console.log("User Addeded", result);
            req.flash("info", "User Registered Successfully");
            res.redirect("/user/login");
          })
          .catch((err) => {
            // console.log("Error : ", err);
            req.flash("info", "Error Occured During Registration");
            res.redirect("/user/register");
          });
      } else {
        req.flash("info", "Email Already Registered");
        res.redirect("/user/register");
      }
    });
  } else {
    req.flash("info", "Name, email or password is Invalid");
    res.redirect("/user/register");
  }
});

// to send login page
router.get("/login", (req, res) => {
  res.render("login", { user: "" });
});

// to login the user after checking email and password
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email, password }).then((result) => {
    // console.log(result);
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

// to destroy the session
router.get("/logout", (req, res) => {
  // delete req.session.email
  req.session.destroy(() => {
    res.redirect("/user/login");
  });
});

module.exports = router;
