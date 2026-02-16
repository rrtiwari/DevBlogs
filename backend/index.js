require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const { router } = require("./router");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "rahul_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
    },
  }),
);

app.set("io", io);

io.on("connection", (socket) => {
  socket.on("join_blog", (blogId) => {
    socket.join(blogId);
  });
});

app.use("/", router);

/* --- CORRECTED DATABASE CONNECTION --- */
const user = process.env.MONGO_USER;
const pass = process.env.MONGO_PASSWORD;
const cluster = "cluster0.xcgbplp.mongodb.net";
const dbName = "TodoApp";

const MONGO_URI = `mongodb+srv://${user}:${pass}@${cluster}/${dbName}?retryWrites=true&w=majority`;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Error:", err);
  });
