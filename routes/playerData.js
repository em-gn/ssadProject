const route = require("express-promise-router")();
const _ = require("lodash");
const { User } = require("../db/models/user");
const PlayerData = require("../db/models/playerData");

route.get("/:username", async (req, res) => {
  const user = await User.findOne({ userName: req.params.username });
  if (!user) {
    return res.status(400).send("No such user.");
  }
  const data = await PlayerData.findOne({ user: user._id }).populate(
    "user",
    "userName -_id"
  );
  res.send(data);
});

route.post("/:username", async (req, res) => {
  const user = await User.findOne({ userName: req.params.username });
  if (!user) {
    return res.status(400).send("No such user.");
  }

  const data = await PlayerData.findOne({ user: user._id });

  if (data)
    return res
      .status(500)
      .send("Player data already exists. Use PUT to update instead.");
  const newData = await PlayerData.create({
    user: user._id,
    lastLevelPlayed: req.body.lastLevelPlayed,
    currentCharacterSprite: req.body.spriteNumber,
  });

  return res.send(newData);
});

route.put("/:username", async (req, res) => {
  const user = await User.findOne({ userName: req.params.username });
  if (!user) {
    return res.status(400).send("No such user.");
  }

  req.body.currentCharacterSprite = req.body.spriteNumber;

  if (
    !(await PlayerData.findOneAndUpdate(
      { user: user._id },
      { $set: _.pick(req.body, ["currentCharacterSprite", "lastLevelPlayed"]) },
      { useFindAndModify: false }
    ))
  ) {
    return res.send("No such data exists to be updated.");
  }

  return res.send("Successfully updated in database.");
});

route.delete("/:username", async (req, res) => {
  const user = await User.findOne({ userName: req.params.username });
  if (!user) {
    return res.status(400).send("No such user.");
  }

  let deletedData = await PlayerData.findOneAndDelete({ user: user._id });
  return res.send(deletedData);
});

module.exports = route;
