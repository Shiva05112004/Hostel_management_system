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
 
// Student management
router.get('/students', AdminController.getAllStudents);
router.get('/students/pending', AdminController.getPendingStudents);
router.post('/students/approve/:id', AdminController.approveStudent);
router.post('/students/reject/:id', AdminController.rejectStudent);
router.post('/students', AdminController.adminAddStudent);
router.delete('/students/:id', AdminController.adminDeleteStudent);

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

// Assign student to room by roomNumber (admin UI can send studentId + roomNumber)
router.post('/assign-by-number', async (req, res) => {
  try {
    const { studentId, roomNumber } = req.body;
    if (!studentId || !roomNumber) return res.status(400).json({ msg: 'studentId and roomNumber required' });

    const room = await Room.findOne({ roomNumber });
    if (!room) return res.status(404).json({ msg: 'Room not found' });
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ msg: 'Student not found' });

    // If student already assigned to this room, nothing to do
    if (student.room && student.room.toString() === room._id.toString()) {
      return res.status(200).json({ msg: 'Student already in this room', room });
    }

    // Remove from previous room occupants if assigned
    if (student.room) {
      try {
        const prevRoom = await Room.findById(student.room);
        if (prevRoom) {
          prevRoom.occupants = prevRoom.occupants.filter(o => o.toString() !== student._id.toString());
          await prevRoom.save();
        }
      } catch (err) {
        // continue
      }
    }

    // Check capacity on new room (after removal from previous room)
    if (room.occupants.length >= room.capacity)
      return res.status(400).json({ msg: 'Room is full' });

    // Add to new room occupants
    if (!room.occupants.some(o => o.toString() === student._id.toString())) {
      room.occupants.push(student._id);
      await room.save();
    }

    student.room = room._id;
    await student.save();

    res.status(200).json({ msg: 'Room assigned successfully', room });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
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



