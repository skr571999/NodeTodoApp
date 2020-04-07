const express = require("express");
const router = express.Router();

const Todo = require("./../models/todo");
const User = require("./../models/user");

function checkAdmin(req, res, next) {
  if (req.session.email && req.session.isAdmin) {
    next();
  } else {
    req.flash("info", "You need to Login");
    res.redirect("/admin/login");
  }
}

router.get("/", (req, res) => {
  res.redirect("/admin/dashboard/");
});

router.get("/login", (req, res) => {
  res.render("login", { user: "" });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email, password })
    .then((user) => {
      if (user && user._doc.isAdmin) {
        req.session.email = user.email;
        req.session.isAdmin = true;
        res.redirect("/admin/dashboard/");
      } else {
        res.send("Not a Admin");
      }
    })
    .catch((err) => {
      res.send("Error Occured");
    });
});

router.get("/dashboard", checkAdmin, (req, res) => {
  Todo.find()
    .populate("userId")
    .then((result) => {
      let user = { email: req.session.email, isAdmin: true };
      //   console.log(result);
      res.render("adminDashboard", { data: result, user: user });
    })
    .catch((err) => {
      console.log(err);
      res.send("Error Occured");
    });
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/admin/");
  });
});

module.exports = router;
