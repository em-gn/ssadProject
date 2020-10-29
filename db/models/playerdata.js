const mongoose = require("mongoose");
const _ = require("lodash");

const playerdataSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    savedState: {
      world: {
        type: Number,
        required: true,
        default: 1,
      },
      level: {
        type: Number,
        default: 1,
      },
    },
    currentCharacterSprite: {
      type: String,
      default: "WarriorType1",
    },
  },
  { strict: false }
);

const PlayerData = mongoose.model("PlayerData", playerdataSchema);

module.exports = PlayerData;
