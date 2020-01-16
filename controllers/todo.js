const express = require("express");
const router = express.Router();

const Todo = require("./../models/todo");

function check_auth(req, res, next) {
  if (req.session.email) {
    next();
  } else {
    res.redirect("/user/login");
  }
}

// home
router.get("/", check_auth, (req, res) => {
  Todo.find({}).then(result => {
    console.log("Data : ", result);

    res.render("home", { todos: result });
  });
});

// add new todo
router.post("/addtodo", (req, res) => {
  console.log(req.body);
  let todo1 = new Todo({ message: req.body.todo });

  todo1.save().then(result => {
    console.log(result);
    res.redirect("/");
  });
});

// update todo get
router.get("/update/:id", (req, res) => {
  Todo.findById(req.params.id).then(result => {
    console.log("data : ", result);
    res.render("update", { data: result });
  });
});

// update todo post
router.post("/update/:id", (req, res) => {
  console.log(req.body);
  Todo.findByIdAndUpdate(req.params.id, { message: req.body.todo }).then(
    result => {
      console.log("After Update : ", result);
      res.redirect("/");
    }
  );
});

// delete todo
router.get("/delete/:id", (req, res) => {
  console.log("Delete : ", req.params.id);

  // // Method One
  // Todo.findByIdAndDelete(req.params.id).then(result => {
  //   console.log('Result : ',result);
  //   res.redirect("/");
  // });
  // // Method Two
  Todo.findOneAndDelete({ _id: req.params.id }).then(result => {
    console.log("Result : ", result);
    res.redirect("/");
  });
});

module.exports = router;
