const mongoose = require("mongoose");

const TodoSchema = mongoose.Schema({
  message: String
});

module.exports = mongoose.model("Todo", TodoSchema);
