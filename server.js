const express = require("express");
const mongoose = require("mongoose");
// const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.url, res.statusCode);
  next();
});

// app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000000
    }
  })
);
app.use(flash());

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
const User = require("./models/user");

app.use("/public", express.static("./public"));

// register get
app.get("/register", (req, res) => {
  res.render("register");
});

// register post
app.post("/register", (req, res) => {
  console.log(req.body);
  let u1 = new User(req.body);

  u1.save().then(result => {
    console.log("User Addeded", result);
    req.flash("info", "User Registered Successfully");

    res.redirect("/login");
  });
});

// login get
app.get("/login", (req, res) => {
  res.render("login");
});

// login Post
app.post("/login", (req, res) => {
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

app.get("/logout", (req, res) => {
  // delete req.session.email
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

function check_auth(req, res, next) {
  if (req.session.email) {
    next();
  } else {
    res.redirect("/login");
  }
}

// home
app.get("/", check_auth, (req, res) => {
  Todo.find({}).then(result => {
    console.log("Data : ", result);

    res.render("home", { todos: result });
  });
});

// add new todo
app.post("/addtodo", (req, res) => {
  console.log(req.body);
  let todo1 = new Todo({ message: req.body.todo });

  todo1.save().then(result => {
    console.log(result);
    res.redirect("/");
  });
});

// update todo get
app.get("/update/:id", (req, res) => {
  Todo.findById(req.params.id).then(result => {
    console.log("data : ", result);
    res.render("update", { data: result });
  });
});

mongoose.set("useFindAndModify", false);
// update todo post
app.post("/update/:id", (req, res) => {
  console.log(req.body);
  Todo.findByIdAndUpdate(req.params.id, { message: req.body.todo }).then(
    result => {
      console.log("After Update : ", result);
      res.redirect("/");
    }
  );
});

// delete todo
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

app.use((req, res) => {
  res.send("Invalid Request");
});

app.listen(PORT, () => {
  console.log(`Serving on ${PORT}`);
});
