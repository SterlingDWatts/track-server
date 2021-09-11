const mongoose = require("mongoose");

const pokerStorySchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true,
  },
  dateAdded: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.models.PokerStory || mongoose.model("PokerStory", pokerStorySchema);
