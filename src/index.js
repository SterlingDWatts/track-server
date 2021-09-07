const mongoose = require("mongoose");
const app = require("./app");
const { PORT, DATABASE_URL } = require("./config");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
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

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("login", () => {
    socket.broadcast.emit("login");
  });
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
