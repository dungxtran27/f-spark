import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import {
  UserRouter,
  AuthenticationRouter,
  VnPayRouter,
  StudentRouter,
  ClassRouter,
  ClassworkRouter,
  GroupRouter,
  MentorRouter,
  TeacherRouter,
  SubmissionRouter,
  TaskRouter,
  TimeBlockRouter,
  TagMajorRouter,
  NotificationRouter,
} from "./routes/index.js";
import "./utils/google-oauth2.js";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { eventScheduler } from "./utils/scheduler.js";
import http from "http";
const app = express();
const server = http.createServer(app);
dotenv.config();
const corsOptions = {
  origin: ["http://localhost:3000", "https://fspark.vercel.app"],
  methods: "PUT, POST, GET, DELETE, OPTIONS, PATCH",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Define endpoint to fetch playlists
app.get("/api/playlists", async (req, res) => {
  try {
    const playlists = await Playlist.find(); // Retrieve all playlists from the database
    res.json(playlists); // Send the playlists as a JSON response
  } catch (error) {
    console.error("Error fetching playlists:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Serve static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(
  "/upload/image",
  express.static(path.join(__dirname, "upload", "image"))
);

app.get("/hello", (req, res) => {
  return res.status(200).json("hello");
});
app.use("/api/auth", AuthenticationRouter);
app.use("/api/user", UserRouter);
app.use("/api/payment", VnPayRouter);
app.use("/api/student", StudentRouter);
app.use("/api/class", ClassRouter);
app.use("/api/classwork", ClassworkRouter);
app.use("/api/group", GroupRouter);
app.use("/api/mentor", MentorRouter);
app.use("/api/teacher", TeacherRouter);
app.use("/api/submission", SubmissionRouter);
app.use("/api/task", TaskRouter);
app.use("/api/timeblock", TimeBlockRouter);
app.use("/api/tagmajor", TagMajorRouter);
app.use("/api/notification", NotificationRouter);
const port = process.env.PORT || 9999;
const MONGODB_URI = process.env.MONGODB_URI;
//for Periodic tasks
// eventScheduler();
const userSocketMap = {};
const io = new Server(server, {
  cors: corsOptions,
});
io.on("connection", (socket) => {
  const account = socket.handshake.query.account;
  console.log("A user just connected", account);
  if (account) {
    userSocketMap[account] = socket.id;
  }
  socket.on("disconnect", () => {
    for (let [accountId, socketId] of Object.entries(userSocketMap)) {
      if (socketId === socket.id) {
        console.log(`User ${accountId} disconnected`);
        delete userSocketMap[accountId]; // Clean up the mapping
        break;
      }
    }
  });
});
server.listen(port, async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.log(`Error connecting to MongoDB: ${error.message}`);
  }
  console.log(`Server running on http://localhost:${port}`);
});
export { io, userSocketMap };
