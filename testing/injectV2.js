const { User } = require("../db/models/user");
const Group = require("../db/models/group");
const Leaderboard = require("../db/models/leaderboard");
const mongoose = require("mongoose");

const names = [
  "Rachel",
  "Ralph",
  "Hady",
  "Muhammad",
  "Jack",
  "Wilshere",
  "David",
  "Putani",
  "Harry",
  "Heung-Min",
  "Reece",
  "Chillwell",
  "Aubameyang",
];
mongoose.connect(
  "mongodb+srv://fazirul001:rWvpw73EvrPjnr6@ssadproject.58svf.mongodb.net/development?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.set("useCreateIndex", true);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async function () {
  console.log("connected to MongoDB...");
  const numOfEntries = 23;
  let count = await User.countDocuments({});
  console.log(
    "\u001b[" + 12 + "m" + "Number of entries: " + "\u001b[0m",
    count
  );
  let leaderboard = await Leaderboard.findOne({ worldID: 2 });
  if (!leaderboard) {
    leaderboard = await Leaderboard.create({ worldID: 2, scores: [] });
  }
  for (let i = 1; i <= numOfEntries; i++) {
    const x = Math.floor(Math.random() * 88);
    let student = {
      fullName: names[i % 12],
      userName: `testuser${i}`,
      hashedPassword: 12345678,
      email: "test@e.ntu.edu.sg",
      score: [
        {
          worldID: 1,
          time: [
            Math.floor(Math.random() * 10) + x,
            Math.floor(Math.random() * 5) + x,
            x,
          ],
          levels: [
            Math.floor(Math.random() * 10) + x,
            Math.floor(Math.random() * 5) + x,
            x,
          ],
        },
        {
          worldID: 2,
          time: [
            Math.floor(Math.random() * 10) + x,
            Math.floor(Math.random() * 5) + x,
            x,
          ],
          levels: [
            Math.floor(Math.random() * 10) + x,
            Math.floor(Math.random() * 5) + x,
            x,
          ],
        },
        {
          worldID: 3,
          time: [
            Math.floor(Math.random() * 10) + x,
            Math.floor(Math.random() * 5) + x,
            x,
          ],
          levels: [
            Math.floor(Math.random() * 10) + x,
            Math.floor(Math.random() * 5) + x,
            x,
          ],
        },
      ],
    };

    student = await User.create(student);
    let totalScore = 0;
    student.score.forEach((s) => {
      if (s.worldID === 2) {
        totalScore += s.levels.reduce((acc, val) => (acc += val), 0);
      }
    });

    leaderboard.scores.set(leaderboard.scores.length, {
      username: student.userName,
      score: totalScore,
    });

    await leaderboard.save();
    let completed = true;
    if (Math.floor(Math.random() * 100) % 3 == 0) completed = false;
  }
  console.log(`--> injected ${numOfEntries} entries into the database`);
  count = await User.countDocuments();
  console.log(
    "\u001b[" + 32 + "m" + "New Number of entries: " + "\u001b[0m",
    count
  );
});
