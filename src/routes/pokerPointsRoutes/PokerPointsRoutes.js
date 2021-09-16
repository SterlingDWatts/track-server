const express = require("express");
const PokerPoints = require("../../models/PokerPoints");

const router = express.Router();

router.post("/poker/points", async (req, res) => {
  const { storyId, userId, points } = req.body;

  if (!storyId || !userId || !points) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }

  const existingPoints = await PokerPoints.findOne({ storyId, userId });
  if (existingPoints) {
    existingPoints.points = points;
    await existingPoints.save();
  } else {
    const newPokerPoints = await new PokerPoints({ storyId, userId, points });
    newPokerPoints.save();
  }

  res.status(200).send({ message: "Poker points saved" });
});

router.get("/poker/points/:storyId", async (req, res) => {
  const { storyId } = req.params;

  const points = await PokerPoints.find({ storyId }).populate("userId");
  if (points) {
    res.status(200).send({ points });
  } else {
    res.status(404).send({ message: "No poker points found" });
  }
});

module.exports = router;
