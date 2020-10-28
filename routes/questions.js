const route = require("express-promise-router")();
const bcrypt = require("bcrypt");
const Question = require("../db/models/questions");
const _ = require("lodash");
const mongoose = require("mongoose");

route.get("/", async (req, res) => {
  let questions = await Question.find();
  res.send(questions);
});

route.get("/:world/:level", async (req, res) => {
  const { world, level } = req.params;
  let questions = await Question.find({ world, level });
  const length = questions.length;
  const rng = Math.floor(Math.random() * length);
  res.send(
    _.pick(questions[rng], ["Title", "A", "B", "C", "D", "Solution", "i"])
  );
});

route.post("/", async (req, res) => {
  q = await Question.create(req.body);
  return res.send(q);
});

route.delete("/:id", async (req, res) => {
  //you need to retrieve the ObjectId of the score document first..
  const deletedQuestion = await Question.findByIdAndDelete(
    mongoose.Types.ObjectId(req.params.id)
  );
  return res.send(deletedQuestion);
});

module.exports = route;
