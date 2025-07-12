<<<<<<< HEAD
import express, { urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoute from './routes/user.route.js'
import postRoute from './routes/post.route.js'
import messageRoute from './routes/message.route.js'
import connectDB from './utils/db.js'
dotenv.config({})

const PORT = process.env.PORT ||  5000
const app = express()
app.get('/',(_,res)=>{
    return res.status(200).json({
        Message:"Backend connected Successfully",
        sucess: true
    })
})
app.use(express.json())
app.use(cookieParser())
app.use(urlencoded({extended:true}))
const corsOptions={
    origin:'http://localhost:5173',
    credentials:true
}
app.use(cors(corsOptions))


app.use("/api/v1/user",userRoute)
app.use("/api/v1/message",messageRoute)
app.use("/api/v1/post",postRoute)


app.listen(PORT, () => {
    console.log(`Server at port ${PORT}`);  
    connectDB()
})
=======
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

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Socket.IO setup with CORS
const io = new Server(server, {
    cors: {
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST"]
  }
});


app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));

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
  });
});
>>>>>>> d997b8b (Initial commit: project ready for deployment)
