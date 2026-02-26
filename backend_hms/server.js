const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
let mongoMemoryServer;
const useInMemory = async () => {
  // Lazy-require to avoid adding in production unless needed
  const { MongoMemoryServer } = require('mongodb-memory-server');
  mongoMemoryServer = await MongoMemoryServer.create();
  return mongoMemoryServer.getUri();
};

const authRoutes = require("./routes/authRoutes");
// const studentRoutes = require("./routes/studentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const complaintRoutes = require("./routes/complaintsRoutes");
const noticeRoutes = require("./routes/NoticeRoutes");
const foodRoutes = require("./routes/foodRoutes");
const foodAttendanceRoutes = require("./routes/foodAttendanceRoutes");
const roomRoutes = require("./routes/roomRoutes"); // ✅ FIXED: Import roomRoutes
console.log("roomRoutes is:", roomRoutes);
const paymentRoutes = require("./routes/paymentRoutes"); 



const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default API root
app.get("/", (req, res) => {
  res.send("🏠 Hostel Management API is running");
});

// Route Middlewares
app.use("/api/auth", authRoutes);
// app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/food-attendance", foodAttendanceRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/student/payments", paymentRoutes);



// ✅ ADDED correctly now

// MongoDB Connection and Server Listener with in-memory fallback
// const startServer = async () => {
//   const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hms';     
//   // const uri = process.env.MONGO_URI;
//   try {
//     await mongoose.connect(uri);
//     console.log("✅ MongoDB connected");
//   } catch (err) {
//     console.warn('⚠️ Could not connect to configured MongoDB. Falling back to in-memory MongoDB.');
//     try {
//       const memUri = await useInMemory();
//       await mongoose.connect(memUri);
//       console.log('✅ Connected to in-memory MongoDB');
//     } catch (memErr) {
//       console.error('❌ In-memory MongoDB failed:', memErr);
//       process.exit(1);
//     }
//   }

//   const PORT = process.env.PORT || 5000;
//   // Create HTTP server and attach Socket.IO for real-time features
//   const http = require('http');
//   const { Server } = require('socket.io');
//   const server = http.createServer(app);

//   const io = new Server(server, {
//     cors: {
//       origin: '*',
//       methods: ['GET', 'POST']
//     }
//   });
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1); // stop server if DB fails
  }

  const PORT = process.env.PORT || 5000;
  const http = require('http');
  const { Server } = require('socket.io');
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // Make io accessible via app for controllers
  app.set('io', io);

  // Socket auth middleware: verify JWT passed in handshake.auth.token
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth && socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication error'));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // { id, role, ... }
      return next();
    } catch (err) {
      console.warn('Socket auth failed:', err.message);
      return next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id, 'user:', socket.user && socket.user.id);

    socket.on('joinRoom', (room) => {
      // Only allow admins to join admin attendance rooms
      try {
        if (!socket.user) return;
        if (socket.user.role !== 'admin') {
          // prevent non-admins joining admin rooms
          console.warn(`Socket ${socket.id} denied joinRoom ${room} (not admin)`);
          return;
        }
        socket.join(room);
      } catch (e) {
        // ignore
      }
    });

    socket.on('leaveRoom', (room) => {
      try {
        if (!socket.user) return;
        if (socket.user.role !== 'admin') return;
        socket.leave(room);
      } catch (e) {}
    });

    socket.on('disconnect', () => {
      // console.log('Socket disconnected:', socket.id);
    });
  });

  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();
// const mongoose = require("mongoose");

// const authRoutes = require("./routes/authRoutes");
// const studentRoutes = require("./routes/studentRoutes");
// const adminRoutes = require("./routes/adminRoutes");
// const complaintRoutes = require("./routes/complaintsRoutes");
// const noticeRoutes = require("./routes/NoticeRoutes");
// const foodRoutes = require("./routes/foodRoutes"); // ✅ <-- this line is essential
// const foodAttendanceRoutes=require("./routes/foodAttendanceRoutes");
// console.log('roomRoutes is a:', typeof roomRoutes);


// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.get("/", (req, res) => {
//   res.send("Hostel Management API is running");
// });

// app.use("/api/auth", authRoutes);
// app.use("/api/student", studentRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/food", foodRoutes); // ✅ won't crash now
// app.use("/api/food-attendance", foodAttendanceRoutes);
// app.use("/api/complaints", complaintRoutes);
// app.use("/api/notices", noticeRoutes);

// mongoose
//   .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hms")
//   .then(() => {
//     console.log("MongoDB connected");
//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("MongoDB connection error:", err);
//   });
  







