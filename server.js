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

app.use("/public", express.static("./public"));

mongoose.set("useFindAndModify", false);

const UserRoute = require("./controllers/user");
const TodoRoute = require("./controllers/todo");

app.get("/", (req, res) => {
  res.redirect("/todo");
});

app.use("/user", UserRoute);
app.use("/todo", TodoRoute);

app.use((req, res) => {
  res.send("Invalid Request");
});

app.listen(PORT, () => {
  console.log(`Serving on ${PORT}`);
});
