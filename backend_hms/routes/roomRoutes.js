const express = require("express");
const router = express.Router();
const Room = require("../models/Room");
const Student = require("../models/Student");
const { assignRoomToStudent , addRoom } = require('../controllers/roomController');
const { verifyToken ,isAdmin } = require("../middleware/authMiddleware");

// @route   GET /api/rooms/available
// @desc    Get all rooms with available space
// @access  Private (Student/Admin)
router.get("/available", verifyToken, async (req, res) => {
  try {
    const rooms = await Room.find();
    const availableRooms = rooms.map(r => ({
      _id: r._id,
      roomNumber: r.roomNumber,
      capacity: r.capacity,
      available: r.capacity - r.occupants.length
    }));
    res.json(availableRooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error while fetching available rooms" });
  }
});

// @route   GET /api/rooms/myroom
// @desc    Get the current logged-in student's room info
// @access  Private (Student)
router.get("/myroom", verifyToken, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).populate("room");
    if (!student) return res.status(404).json({ msg: "Student not found" });

    res.json(student.room);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error while fetching student room" });
  }
});
router.post('/assign', verifyToken, isAdmin, assignRoomToStudent);
router.post("/admin/add-room", verifyToken,isAdmin, addRoom);

  module.exports= router;
//in class
// // const express = require("express");
// const router = express.Router();
// const Room = require("../models/Room1");
// const Student = require("../models/Student");
// const { verifyToken } = require("../middleware/authMiddleware");

// // Get available rooms
// router.get("/available", verifyToken, async (req, res) => {
//   try {
//     const rooms = await Room.find();
//     const availableRooms = rooms.map(r => ({
//       _id: r._id,
//       roomNumber: r.roomNumber,
//       capacity: r.capacity,
//       available: r.capacity - r.occupants.length
//     }));
//     res.json(availableRooms);
//   } catch (err) {
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// // Get student room
// router.get("/myroom", verifyToken, async (req, res) => {
//   try {
//     const student = await Student.findById(req.user.id).populate("room");
//     if (!student) return res.status(404).json({ msg: "Student not found" });

//     res.json(student.room);
//   } catch (err) {
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// module.exports = router;


// const express = require("express");
// const mongoose = require("mongoose");
// const router = express.Router();
// const Room = require("../models/Room");
// const authMiddleware = require("../middleware/authMiddleware");

// // Get all rooms
// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     const rooms = await Room.find().populate("occupants");
//     res.json(rooms);
//   } catch (err) {
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// // Add a room
// router.post("/", authMiddleware, async (req, res) => {
//   try {
//     const room = new Room(req.body);
//     await room.save();
//     res.status(201).json(room);
//   } catch (err) {
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// module.exports = router;