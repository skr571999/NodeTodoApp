const express = require("express");
const router = express.Router();

const Todo = require("./../models/todo");
const User = require("./../models/user");

function check_auth(req, res, next) {
  if (req.session.email) {
    next();
  } else {
    req.flash("info", "You need to Login");
    res.redirect("/user/login");
  }
}

// home
router.get("/", check_auth, (req, res) => {
  User.find({ email: req.session.email }).then((users) => {
    let userId = users[0]._id;
    Todo.find({ userId: userId })
      .then((result) => {
        let user = { email: req.session.email };
        res.render("home", { todos: result, user: user });
      })
      .catch((err) => {
        res.send("Error Occured");
      });
  });
});

// add new todo
router.post("/addtodo", check_auth, (req, res) => {
  User.find({ email: req.session.email }).then((users) => {
    let userId = users[0]._id;

    let todo1 = new Todo({ message: req.body.todo, userId: userId });

    todo1.save().then((result) => {
      res.redirect("/");
    });
  });
});

// update todo get
router.get("/update/:id", check_auth, (req, res) => {
  Todo.findById(req.params.id)
    .then((result) => {
      let user = { email: req.session.email };
      res.render("update", { data: result, user: user });
    })
    .catch((err) => {
      res.send("Error Occured");
    });
});

// update todo post
router.post("/update/:id", check_auth, (req, res) => {
  Todo.findByIdAndUpdate(req.params.id, { message: req.body.todo }).then(
    (result) => {
      res.redirect("/");
    }
  );
});

// delete todo
router.get("/delete/:id", check_auth, (req, res) => {
  Todo.findOneAndDelete({ _id: req.params.id }).then((result) => {
    res.redirect("/");
  });
});

module.exports = router;
