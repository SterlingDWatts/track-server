const express = require("express");
const jwt = require("jsonwebtoken");
const xss = require("xss");
const PokerUser = require("../../models/PokerUser");

const router = express.Router();

const twoHoursFromNow = () => {
  return Math.floor(Date.now() / 1000) + 60 * 60 * 2;
};

router.post("/poker/login", async (req, res) => {
  let { name, role } = req.body;
  name = xss(name);
  role = xss(role);

  if (!name || !role) {
    return res.status(422).send({ error: "Must provide name and role." });
  }

  const user = await PokerUser.findOne({ name });
  if (!user) {
    const newUser = new PokerUser({ name, role });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, name, role, exp: twoHoursFromNow() }, process.env.JWT_KEY);
    res.status(201).send({ token, newUser });
  }

  const token = jwt.sign({ id: user._id, name, role, exp: twoHoursFromNow() }, process.env.JWT_KEY);

  setTimeout(() => {
    PokerUser.remove({ name });
  }, twoHoursFromNow());

  res.status(201).send({ token, user });
});

module.exports = router;
