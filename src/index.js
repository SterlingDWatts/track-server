const mongoose = require("mongoose");
const app = require("./app");
const { PORT, DATABASE_URL } = require("./config");
const http = require("http");
const { Server } = require("socket.io");
const PokerUser = require("./models/PokerUser.js");

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to mongo instance");
});

mongoose.connection.on("error", (err) => {
  console.error("Error connecting to mongo", err);
});

io.on("connection", async (socket) => {
  console.log("connected");
  socket.on("login", (user) => {
    socket.data.user = user;
    socket.broadcast.emit("login");
  });

  socket.on("addStories", () => {
    socket.broadcast.emit("addStories");
  });

  socket.on("points", () => {
    socket.broadcast.emit("points");
  });

  socket.on("disconnect", async () => {
    if (socket && socket.data && socket.data.user && socket.data.user.name) {
      await PokerUser.updateOne({ name: socket.data.user.name }, { isLoggedIn: false });
      socket.broadcast.emit("disconnected");
    }
  });
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
