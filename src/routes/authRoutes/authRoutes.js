const express = require("express");
const jwt = require("jsonwebtoken");
const xss = require("xss");
const User = require("../../models/User");

const router = express.Router();

function serializeUser({ firstName, lastName, email, password }) {
  return {
    firstName: xss(firstName),
    lastName: xss(lastName),
    email: xss(email),
    password,
  };
}

router.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  const serializedUser = serializeUser({ firstName, lastName, email, password });

  try {
    const user = new User(serializedUser);
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY);
    res.header("Access-Control-Allow-Origin", "*");
    res.status(201).send({ token });
  } catch (err) {
    res.header("Access-Control-Allow-Origin", "*");
    return res.status(422).json({ error: err.message });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.header("Access-Control-Allow-Origin", "*");
    return res.status(422).send({ error: "Must provide email and password." });
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.header("Access-Control-Allow-Origin", "*");
    return res.status(422).send({ error: "Invalid password or email." });
  }

  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY);
    res.send({ token });
  } catch (err) {
    res.header("Access-Control-Allow-Origin", "*");
    return res.status(422).send({ error: "Invalid password or email." });
  }
});

module.exports = router;
