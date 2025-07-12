import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";
import connectDB from "./utils/db.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import messageRoutes from "./routes/message.route.js";
import seedRoutes from "./routes/seed.route.js";
import notificationRoutes from "./routes/notification.route.js";
import recruitmentRoutes from "./routes/recruitment.route.js";

const app = express();
const server = createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://gameverse-cog.vercel.app';

// Socket.IO setup with CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"]
  }
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/message", messageRoutes);
app.use("/api/v1/seed", seedRoutes);
app.use("/api/v1/notification", notificationRoutes);
app.use("/api/v1/recruitment", recruitmentRoutes);

// Socket.IO connection handling
let activeUsers = 0;

io.on('connection', (socket) => {
  activeUsers++;
  console.log(`User connected. Active users: ${activeUsers}`);
  
  socket.on('disconnect', () => {
    activeUsers--;
    console.log(`User disconnected. Active users: ${activeUsers}`);
  });
});

// Make io available to routes
app.set('io', io);

const PORT = process.env.PORT || 8000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server at port ${PORT}`);
    console.log('Allowed CORS origins:', allowedOrigins);
  });
});
