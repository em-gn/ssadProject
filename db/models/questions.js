const mongoose = require("mongoose");
const _ = require("lodash");

const questionSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: true,
    },
    Solution: String,
    A: String,
    B: String,
    C: String,
    D: String,
    level: Number,
    world: Number,
  },
  { strict: false }
);

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
