const express = require("express");
const jwt = require("jsonwebtoken");
const xss = require("xss");
const PokerUser = require("../../models/PokerUser");

const router = express.Router();

router.post("/poker/login", async (req, res) => {
  let { name, role, expDate } = req.body;
  name = xss(name);
  role = xss(role);
  expDate = xss(expDate);

  if (!name || !role || !expDate) {
    return res.status(422).send({ error: "Must provide name, role, and expDate." });
  }

  const user = await PokerUser.findOne({ name });
  if (!user) {
    const newUser = new PokerUser({ name, role, expDate });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, name, role, expDate }, process.env.JWT_KEY);
    res.status(201).send({ token, user: newUser });
  }

  // todo possibly clean up
  user.expDate = new Date(expDate);
  user.role = role;
  user.save();

  const token = jwt.sign({ id: user._id, name, role, expDate }, process.env.JWT_KEY);

  res.status(200).send({ token, user });
});

module.exports = router;
