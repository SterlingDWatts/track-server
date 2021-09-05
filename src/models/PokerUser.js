const mongoose = require("mongoose");

const pokerUserSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["Front End Dev", "QAE", "Team Lead"],
  },
  expDate: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.models.PokerUser || mongoose.model("PokerUser", pokerUserSchema);
