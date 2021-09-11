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
    console.log(user);
    socket.data.user = user;
    socket.broadcast.emit("login");
  });

  socket.on("addStories", (stories) => {
    console.log(stories);
    socket.emit("addStories");
  });

  socket.on("disconnect", async () => {
    try {
      await PokerUser.updateOne({ name: socket.data.user.name }, { isLoggedIn: false });
      console.log(socket.data.user);
      socket.broadcast.emit("disconnected");
    } catch (e) {
      console.log(e);
    }
  });
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
