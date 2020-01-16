const express = require("express");
const router = express.Router();

const User = require("./../models/user");

// register get
router.get("/register", (req, res) => {
  res.render("register");
});

// register post
router.post("/register", (req, res) => {
  console.log(req.body);
  let u1 = new User(req.body);

  u1.save().then(result => {
    console.log("User Addeded", result);
    req.flash("info", "User Registered Successfully");

    res.redirect("/login");
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
      res.redirect("/");
    } else {
      res.redirect("/login");
    }
  });
});

router.get("/logout", (req, res) => {
  // delete req.session.email
  req.session.destroy(() => {
    res.redirect("/user/login");
  });
});

module.exports = router;
