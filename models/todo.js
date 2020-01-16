const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
  message: String
});

module.exports = mongoose.model("Todo", todoSchema);
