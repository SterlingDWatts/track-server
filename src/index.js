const express = require("express");
// const mongoose = require("mongoose");
const { PORT, DATABASE_URL } = require("./config");

console.log(DATABASE_URL);

// mongoose.connect(DATABASE_URL, {
//   useNewUrlParser: true,
//   useCreateIndex: true,
// });
//
// mongoose.connection.on("connected", () => {
//   console.log("Connected to mongo instance");
// });
// mongoose.connection.on("error", (err) => {
//   console.error("Error connecting to mongo", err);
// });

const app = express();

app.get("/", (req, res) => {
  res.send("Hi there!");
});

app.listen(3000, () => {
  console.log(`Listening on port ${PORT}`);
});
