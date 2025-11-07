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

// Define allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://gameverse-cog.vercel.app',
  'https://gameverse-cog.vercel.app/',
  process.env.FRONTEND_URL
].filter(Boolean); // Remove any undefined values

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Remove trailing slash for comparison
    const cleanOrigin = origin.replace(/\/$/, '');
    const cleanAllowedOrigins = allowedOrigins.map(origin => origin.replace(/\/$/, ''));
    
    if (cleanAllowedOrigins.includes(cleanOrigin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
};

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
  // console.log(`User connected. Active users: ${activeUsers}`);
  // further can be used for real time notifications and load balancing
  
  socket.on('disconnect', () => {
    activeUsers--;
    // console.log(`User disconnected. Active users: ${activeUsers}`);
  });
});

// Make io available to routes
app.set('io', io);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server at port ${PORT}`);
    console.log('Allowed CORS origins:', allowedOrigins);
  });
});
