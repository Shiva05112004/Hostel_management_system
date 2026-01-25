const express = require('express');
const router = express.Router();

const {verifyToken,isAdmin} = require('../middleware/authMiddleware');
//const isAdmin = require("../middleware/verifyAdmin");

const AdminController = require('../controllers/adminController');
const Room = require("../models/Room");
const Student = require("../models/Student");
const { getAllComplaints, updateComplaintStatus } = require('../controllers/complaintController');

// Apply verifyToken middleware to all admin routes
router.use(verifyToken);
router.use(isAdmin);

// Food routes
router.get('/food-attendance', AdminController.getFoodAttendance);
router.post('/food-menu', AdminController.addFoodItem);
router.get('/food-menu', AdminController.getMenuItems);
router.delete('/food-menu/:id', AdminController.deleteFoodItem);

// Complaints routes
router.get('/complaints', getAllComplaints);
router.put('/complaints/:id', updateComplaintStatus);

// Payments and notices
router.get('/payments', AdminController.getAllPayments);
router.post('/notices', AdminController.postNotice);
router.get('/notices', AdminController.getAllNotices);

// Rooms list
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find().populate("occupants", "name email");
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Add a new room
router.post("/", async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Assign student to room
router.post("/assign", async (req, res) => {
  try {
    const { studentId, roomId } = req.body;

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ msg: "Room not found" });

    if (room.occupants.length >= room.capacity)
      return res.status(400).json({ msg: "Room is full" });

    if (!room.occupants.includes(studentId)) {
      room.occupants.push(studentId);
      await room.save();
    }

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ msg: "Student not found" });

    student.room = room._id;
    await student.save();

    res.status(200).json({ msg: "Room assigned successfully", room });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;

// const express = require('express');

// const router = express.Router();
// const verifyToken = require('../middleware/authMiddleware');
// const AdminController = require('../controllers/adminController');
// const Room = require("../models/Room");
// const Student = require("../models/students");
// const isAdmin = require("../middleware/verifyAdmin");

// const {
//   getAllComplaints,
//   updateComplaintStatus,
// } = require('../controllers/complaintController');

// const verifyAdmin = require('../middleware/verifyAdmin'); 


// router.use(verifyToken);

// // Use the correct function names from the controller
// router.get('/food-attendance', AdminController.getFoodAttendance);
// router.post('/food-menu', AdminController.addFoodItem);
// router.get('/food-menu', AdminController.getMenuItems);
// router.delete('/food-menu/:id', AdminController.deleteFoodItem);

// router.get('/complaints', AdminController.getAllComplaints);
// router.get('/payments', AdminController.getAllPayments);
// router.post('/notices', AdminController.postNotice);
// router.get('/notices', AdminController.getAllNotices);
// // custom middleware
// router.get("/", verifyToken, isAdmin, async (req, res) => {
//   try {
//     const rooms = await Room.find().populate("occupants", "name email");
//     res.json(rooms);
//   } catch (err) {
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// // Add a new room
// router.post("/", verifyToken, isAdmin, async (req, res) => {
//   try {
//     const room = new Room(req.body);
//     await room.save();
//     res.status(201).json(room);
//   } catch (err) {
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// // Assign student to room
// router.post("/assign", verifyToken, isAdmin, async (req, res) => {
//   try {
//     const { studentId, roomId } = req.body;

//     const room = await Room.findById(roomId);
//     if (!room) return res.status(404).json({ msg: "Room not found" });

//     if (room.occupants.length >= room.capacity)
//       return res.status(400).json({ msg: "Room is full" });

//     if (!room.occupants.includes(studentId)) {
//       room.occupants.push(studentId);
//       await room.save();
//     }

//     const student = await Student.findById(studentId);
//     if (!student) return res.status(404).json({ msg: "Student not found" });

//     student.room = room._id;
//     await student.save();

//     res.status(200).json({ msg: "Room assigned successfully", room });
//   } catch (err) {
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// // Admin routes
// router.get('/complaints', verifyToken, verifyAdmin, getAllComplaints);
// router.put('/complaints/:id', verifyToken, verifyAdmin, updateComplaintStatus);


// module.exports = router;



