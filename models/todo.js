const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
  message: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = mongoose.model("Todo", todoSchema);
