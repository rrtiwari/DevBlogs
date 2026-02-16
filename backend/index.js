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

const allowedOrigins = [
  "http://localhost:5173",          
  "https://dev-blogs-six.vercel.app"  
];


const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);

app.use(cors({ 
  origin: allowedOrigins, 
  credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const isProduction = process.env.NODE_ENV === "production";

app.use(
  session({
    secret: process.env.SESSION_SECRET || "rahul_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax", 
      maxAge: 1000 * 60 * 60 * 24 
    },
  })
);

app.use("/", router);

const user = process.env.MONGO_USER;
const pass = process.env.MONGO_PASSWORD;
const cluster = "cluster0.xcgbplp.mongodb.net"; 
const dbName = "TodoApp"; 

const MONGO_URI = process.env.MONGO_URI || `mongodb+srv://${user}:${pass}@${cluster}/${dbName}?retryWrites=true&w=majority`;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Error:", err);
  });