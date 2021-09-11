const express = require("express");
const PokerStory = require("../../models/PokerStory");

const router = express.Router();

router.get("/poker/stories", async (_, res) => {
  let twelveHoursAgo = new Date();
  twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12);
  const stories = await PokerStory.find({ dateAdded: { $gt: twelveHoursAgo } });
  res.status(201).send({ stories });
});

router.post("/poker/stories", async (req, res) => {
  const { stories } = req.body;
  for (const story of stories) {
    try {
      const storyDoc = await new PokerStory({ title: story.title, dateAdded: story.dateAdded });
      await storyDoc.save();
    } catch (e) {
      console.log(e);
    }
    res.status(201);
  }
});

module.exports = router;
