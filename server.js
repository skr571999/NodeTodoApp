const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("express-flash");

const PORT = process.env.PORT || 3000;
const app = express();

let DB_URL = "mongodb://localhost:27017/test";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.url, req.method, res.statusCode);
  next();
});

// for session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000000,
    },
  })
);
app.use(flash());

// Setting View Engine
app.set("view engine", "ejs");

// Database Connection
mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log("DB not Connected");
    // process.exit();
  });

// route for static folder
app.use("/public", express.static("./public"));

app.get("/", (req, res) => {
  res.redirect("/todo");
});

// Controllers
app.use("/user", require("./controllers/user"));
app.use("/todo", require("./controllers/todo"));
app.use("/admin", require("./controllers/admin"));

// to handle invalid requests
app.use((req, res) => {
  res.status(404).send("Invalid Request");
});

app.listen(PORT, () => {
  console.log(`Serving on ${PORT}`);
});
