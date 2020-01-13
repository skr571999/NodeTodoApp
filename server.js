const express = require("express");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");

// Database Connection
mongoose
  .connect("mongodb://localhost:27017/tododata", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("DB Connected");
  })
  .catch(err => {
    console.log("DB not Connected");
    // process.exit();
  });

const Todo = require("./models/todo");

app.use("/public", express.static("./public"));

app.get("/", (req, res) => {
  Todo.find({}).then(result => {
    console.log("Data : ", result);

    res.render("home", { todos: result });
  });
});

app.post("/addtodo", (req, res) => {
  console.log(req.body);
  let todo1 = new Todo({ message: req.body.todo });

  todo1.save().then(result => {
    console.log(result);
    res.redirect("/");
  });
});

app.get("/update/:id", (req, res) => {
  Todo.findById(req.params.id).then(result => {
    console.log("data : ", result);
    res.render("update", { data: result });
  });
});

mongoose.set("useFindAndModify", false);
app.post("/update/:id", (req, res) => {
  console.log(req.body);
  Todo.findByIdAndUpdate(req.params.id, { message: req.body.todo }).then(
    result => {
      console.log("After Update : ", result);
      res.redirect("/");
    }
  );
});

app.get("/delete/:id", (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Serving on ${PORT}`);
});
