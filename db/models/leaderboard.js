const mongoose = require("mongoose");
const _ = require("lodash");

const leaderboardSchema = new mongoose.Schema(
  {
    worldID: {
      type: Number,
      required: true,
    },
    scores: [
      {
        _id: false,
        username: String,
        score: Number,
      },
    ],
  },
  { strict: false }
);

const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);

module.exports = Leaderboard;
