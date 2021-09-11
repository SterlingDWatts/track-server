const express = require("express");
const jwt = require("jsonwebtoken");
const xss = require("xss");
const PokerUser = require("../../models/PokerUser");

const router = express.Router();

router.post("/poker/login", async (req, res) => {
  let { name, role, isLoggedIn } = req.body;
  name = xss(name);
  role = xss(role);

  if (!name || !role || !isLoggedIn) {
    return res.status(422).send({ error: "Must provide name, role, and isLoggedIn." });
  }

  const user = await PokerUser.findOne({ name });
  if (!user) {
    const newUser = new PokerUser({ name, role, isLoggedIn });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, name, role, isLoggedIn }, process.env.JWT_KEY);
    res.status(201).send({ token, user: newUser });
  }

  await PokerUser.updateOne({ name }, { isLoggedIn });

  const token = jwt.sign({ id: user._id, name, role, isLoggedIn }, process.env.JWT_KEY);

  res.status(200).send({ token, user });
});

module.exports = router;
