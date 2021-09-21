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
    const { title, dateAdded, position, _id } = story;

    PokerStory.findById(_id, async (err, existingStory) => {
      if (err) {
        const newStory = await new PokerStory({ title, dateAdded, position });
        await newStory.save();
      } else {
        existingStory.title = title;
        existingStory.dateAdded = dateAdded;
        existingStory.position = position;
        await existingStory.save();
      }
    });
  }

  const twelveHoursAgo = new Date();
  twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12);
  const recentStories = await PokerStory.find({ dateAdded: { $gt: twelveHoursAgo } }).sort({ position: "asc" });

  res.status(201).send({ stories: recentStories });
});

router.delete("/poker/stories/:id", async (req, res) => {
  await PokerStory.findByIdAndDelete(req.params.id);

  res.status(200).send({ message: "Story deleted" });
});

module.exports = router;
