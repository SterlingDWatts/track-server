const express = require("express");
const PokerUser = require("../../models/PokerUser");

const router = express.Router();

router.get("/poker/users", async (req, res) => {
  const users = await PokerUser.find({ isLoggedIn: true });
  res.header("Access-Control-Allow-Origin", "*");
  res.status(201).send({ users });
});

module.exports = router;
