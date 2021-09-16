const mongoose = require("mongoose");

const pokerStorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  dateAdded: {
    type: Date,
    required: true,
  },
  position: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.models.PokerStory || mongoose.model("PokerStory", pokerStorySchema);
