const route = require("express-promise-router")();
const mongoose = require("mongoose");
const _ = require("lodash");
const Group = require("../db/models/group");
const { User } = require("../db/models/user");
const Leaderboard = require("../db/models/leaderboard");
const PlayerData = require("../db/models/playerData");

route.get("/:groupID", async (req, res) => {
  const groupID = Integer.parseInt(req.params.groupID);
  let group = await Group.find({ groupID });
  return res.send(group.students);
});

route.get("/", async (req, res) => {
  let groups = await Group.find().populate("students.student");
  let allStudents = [];
  groups.forEach((group) => {
    allStudents = allStudents.concat(group.students);
  });

  return res.send(allStudents);
});

route.post("/:username", async (req, res) => {
  //this is for both update & putting new
  const { score, level, world, time } = req.body;

  let leaderboard = await Leaderboard.findOne({ worldID: world });
  if (!leaderboard) {
    leaderboard = await Leaderboard.create({ worldID: world, scores: [] });
  }

  const { username } = req.params;
  const student = await User.findOne({ userName: username });
  let totalScore = 0 + score;
  student.score.forEach((s) => {
    if (s.worldID === world) {
      totalScore += s.levels.reduce((acc, val) => (acc += val), 0);
    }
  });
  const playerdata = await PlayerData.findOne({ user: student._id });
  if (world == playerdata.savedState.world) {
    if (level >= playerdata.savedState.level) {
      playerdata.savedState.world = world;
      playerdata.savedState.level = level;
      await playerdata.save();
    }
  } else if (world > playerdata.savedState.world) {
    playerdata.savedState.world = world;
    playerdata.savedState.level = level;
    await playerdata.save();
  }

  leaderboard.scores.set(leaderboard.scores.length - 1, {
    username: student.userName,
    score: totalScore,
  });

  await student.setScore(world, level, score, time);
  await leaderboard.save();
  return res.send(student);
});

route.get("/:worldID/leaderboard", async (req, res) => {
  const { worldID } = req.params;
  const leaderboard = await Leaderboard.findOne({ worldID });
  leaderboard.scores.sort((a, b) => {
    return b.score - a.score;
  });
  return res.send(leaderboard.scores.slice(0, 10));
});
module.exports = route;
