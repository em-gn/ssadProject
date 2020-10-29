const route = require("express-promise-router")();
const bcrypt = require("bcrypt");
const { User, validate } = require("../db/models/user");
const _ = require("lodash");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

route.get("/", async (req, res) => {
  let users = await User.find();

  res.send(
    users.map((user) =>
      _.pick(user, ["fullName", "isTeacher", "email", "userName"])
    )
  );
});

route.get("/verified", async (req, res) => {
  let users = await User.find({ verified: false });

  res.send(
    users.map((user) =>
      _.pick(user, ["fullName", "isTeacher", "email", "phoneNumber"])
    )
  );
});

route.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if username already exists in database
  let user = await User.findOne({ userName: req.body.userName });
  if (user)
    return res.status(400).send({ userName: "Username already exists." });

  const salt = await bcrypt.genSalt(10);
  req.body.hashedPassword = await bcrypt.hash(req.body.password, salt);

  user = new User(
    _.pick(req.body, [
      "userName",
      "fullName",
      "hashedPassword",
      "email",
      "isTeacher",
      "isAdmin",
    ])
  );
  user = await user.save();
  await user.initializeSavedState();
  const savedState = await user.getSavedState();
  const { level, world } = savedState.savedState;
  const token = user.generateAuthToken();
  const data = {
    username: user.userName,
    level,
    world,
    token,
    sprite: savedState.currentCharacterSprite,
  };
  res.header("x-token", token);
  return res.header("access-control-expose-headers", "x-token").send(data);
});

route.put("/verified", async (req, res) => {
  const { err } = await User.updateOne(
    { email: req.body.email },
    {
      $set: { verified: true },
    }
  );
  if (err) {
    return res.send(err);
  }
  return res.send(`User ${req.body.fullName} is verified.`);
});

route.put("/", auth, async (req, res) => {
  const userID = await User.findOne({ userName: req.user.userName });
  const updated = await User.findByIdAndUpdate(
    userID._id,
    {
      $set: { phoneNumber: req.body.phoneNumber },
    },
    { useFindAndModify: false }
  );
  return res.send("Successfully updated phone number.");
});

route.delete("/:username", [auth, admin], async (req, res) => {
  const { userName } = req.user;
  if (userName == req.params.username) {
    return res
      .status(403)
      .send("You are not allowed to delete yourself from the database!");
  }

  const user = await User.findOne({ userName: req.params.username });
  if (!user) {
    return res.status(400).send("No such user exist in the database!");
  }

  const { err } = await user.deleteOne();
  if (!err)
    return res.send(`User:${req.params.username} deleted successfully.`);
});

route.get("/me", auth, async (req, res) => {
  const { userName } = req.user;
  const user = await User.findOne({ userName });
  if (!user) return res.status(400).send("No such user!");
  res.send(user);
});

module.exports = route;
