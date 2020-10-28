const Question = require("../db/models/questions");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/ssadProject", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.set("useCreateIndex", true);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async function () {
  console.log("connected to MongoDB...");
  const numOfEntries = 5;
  let count = await Question.countDocuments({});
  console.log(
    "\u001b[" + 32 + "m" + "Number of entries: " + "\u001b[0m",
    count
  );
  for (let i = 1; i <= numOfEntries; i++) {
    const question = {
      Title: `Database Test Entry Number ${i}`,
      A: "1",
      B: "2",
      C: "3",
      D: "4",
      Solution: "C",
      level: i % 10,
      world: i % 5,
    };
    await Question.create(question);
  }
  console.log(`--> injected ${numOfEntries} entries into the database`);
  count = await Question.countDocuments({});
  console.log(
    "\u001b[" + 32 + "m" + "New Number of entries: " + "\u001b[0m",
    count
  );
});
