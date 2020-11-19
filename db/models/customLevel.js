const mongoose = require("mongoose");
const _ = require("lodash");

const customLevelSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      unique: true,
    },
    level_info: mongoose.Mixed,
  },
  { strict: false }
);

const CustomLevel = mongoose.model("CustomLevel", customLevelSchema);

module.exports = CustomLevel;
