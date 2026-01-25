const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

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

// MongoDB Connection and Server Listener
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hms", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
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
  







