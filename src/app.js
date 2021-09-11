require("./models/User");
require("./models/Track");
require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const requireAuth = require("./middlewares/requireAuth");
const authRoutes = require("./routes/authRoutes/authRoutes");
const trackRoutes = require("./routes/trackRoutes/trackRoutes");
const pokerLoginRoutes = require("./routes/pokerLoginRoutes/pokerLoginRoutes");
const pokerUsersRoutes = require("./routes/pokerUsersRoutes/pokerUsersRoutes");
const pokerStortyRoutes = require("./routes/pokerStoryRoutes/pokerStoryRoutes");

const app = express();

app.use(helmet());
app.use(cors());

app.use(express.json());

app.use(pokerLoginRoutes);
app.use(pokerUsersRoutes);
app.use(pokerStortyRoutes);

app.get("/", requireAuth, (req, res) => {
  res.send(`Your email is: ${req.user.email}`);
});
app.use(authRoutes);
app.use(trackRoutes);

module.exports = app;
