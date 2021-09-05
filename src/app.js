require("./models/User");
require("./models/Track");
require("dotenv").config();
const express = require("express");
const requireAuth = require("./middlewares/requireAuth");
const authRoutes = require("./routes/authRoutes/authRoutes");
const trackRoutes = require("./routes/trackRoutes/trackRoutes");
const pokerLoginRoutes = require("./routes/pokerLoginRoutes/pokerLoginRoutes");

const app = express();

app.use(express.json());

app.use(pokerLoginRoutes);

app.get("/", requireAuth, (req, res) => {
  res.send(`Your email is: ${req.user.email}`);
});
app.use(authRoutes);
app.use(trackRoutes);

module.exports = app;
