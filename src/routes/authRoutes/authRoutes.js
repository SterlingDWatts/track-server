const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const AuthService = require("./AuthService");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  const passwordError = AuthService.validatePassword(password);
  if (passwordError) {
    return res.status(400).json({
      error: passwordError,
    });
  }

  try {
    const serializedUser = AuthService.serializeUser({ email, password, firstName, lastName });
    const user = new User(serializedUser);
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY);
    res.status(201).send({ token });
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send({ error: "Must provide email and password." });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(422).send({ error: "Invalid password or email." });
  }

  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY);
    res.send({ token });
  } catch (err) {
    return res.status(422).send({ error: "Invalid password or email." });
  }
});

module.exports = router;
