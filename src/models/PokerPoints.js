const mongoose = require("mongoose");

const pokerPointsSchema = new mongoose.Schema({
  storyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PokerStory",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PokerUser",
    required: true,
  },
});

module.exports = mongoose.models.PokerPoints || mongoose.model("PokerPoints", pokerPointsSchema);
