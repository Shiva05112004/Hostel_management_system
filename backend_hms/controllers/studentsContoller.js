const Room = require('../models/Room1');
const Notice = require('../models/Notice');
const Payment = require('../models/Payment');

// ✅ Get all rooms
const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get all notices
const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    console.error('Error fetching notices:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get payments for the logged-in student
const getStudentPayments = async (req, res) => {
  try {
    const studentId = req.user.id; // Provided by verifyToken middleware
    const payments = await Payment.find({ student: studentId });
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
// const getStudents = async (req, res) => {
//   try {
//     // Dummy or actual DB logic
//     res.status(200).json({ message: "All students fetched successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// ✅ Export all functions
module.exports = {
  getRooms,
  getNotices,
  getStudentPayments,
  // getStudents,
};

// const Room = require('../models/Room1');
// const Notice = require('../models/Notice');
// const Payment = require('../models/Payment');
// const Complaint = require('../models/Complaint');

// // Get all rooms
// exports.getRooms = async (req, res) => {
//   const rooms = await Room.find();
//   res.json(rooms);
// };

// // Get all notices
// exports.getNotices = async (req, res) => {
//   const notices = await Notice.find().sort({ createdAt: -1 });
//   res.json(notices);
// };

// const Payment = require('../models/Payment'); // Ensure model exists

// const getPayments = async (req, res) => {
//   try {
//     const studentId = req.user.id; // Provided by verifyToken middleware
//     const payments = await Payment.find({ student: studentId }); // assuming 'student' field references user ID
//     res.json(payments);
//   } catch (error) {
//     console.error('Error fetching payments:', error.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// module.exports = {
//   getStudentPayments,

// };

// Get student payments
// exports.getPayments = async (req, res) => {
//   const payments = await Payment.find({ student: req.user.id });
//   res.json(payments);
// };

// Post complaint
exports.postComplaint = async (req, res) => {
  const { message } = req.body;
  const newComplaint = new Complaint({
    student: req.user.id,
    message,
    status: 'Pending'
  });
  await newComplaint.save();
  res.json({ message: 'Complaint submitted' });
};
// const User = require("../models/User");

// exports.getAllStudents = async (req, res) => {
//   try {
//     const students = await User.find({ role: "student" }).populate("room");
//     res.json(students);
//   } catch (err) {
//     res.status(500).json({ msg: "Server error" });
//   }
// };

// exports.getStudentById = async (req, res) => {
//   try {
//     const student = await User.findById(req.params.id).populate("room");
//     res.json(student);
//   } catch (err) {
//     res.status(500).json({ msg: "Server error" });
//   }
// };
