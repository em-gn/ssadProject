const route = require("express-promise-router")();
const _ = require("lodash");
const CustomLevel = require("../db/models/customLevel");

route.get("/:username", async (req, res) => {
  const level = await CustomLevel.findOne({
    userName: req.params.username,
  });

  if (!level) {
    return res.status(400).send("User does not have any custom level.");
  }

  console.log(level.level_info);

  return res.send(level.level_info);
});

route.post("/:username", async (req, res) => {
  const level = await CustomLevel.findOne({ userName: req.params.username });
  console.log(req.body)

  if (level) {
    level.level_info = req.body;
    return res.send(await level.save());
  }

  const newObj = {
    userName: req.params.username,
    level_info: req.body,
  };


  return res.send(await CustomLevel.create(newObj));
});

route.delete("/:username", async (req, res) => {
  return res.send(
    await CustomLevel.findOneAndDelete({ userName: req.params.username })
  );
});

module.exports = route;
