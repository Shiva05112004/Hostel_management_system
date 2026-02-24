const Complaint = require('../models/Complaint');
const FoodMenu = require('../models/FoodMenu');
const FoodAttendance = require('../models/FoodAttendance');
const Notice = require('../models/Notice');
const Payment = require('../models/Payment');
const User = require('../models/User');
const Student = require('../models/Student');
const Room = require('../models/Room');


const getAllComplaints = async (req, res) => {
  const complaints = await Complaint.find().populate('student', 'name email');
  res.json(complaints);
};


const updateComplaintStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  await Complaint.findByIdAndUpdate(id, { status });
  res.json({ message: 'Complaint status updated' });
};

const getFoodAttendance = async (req, res) => {
  const records = await FoodAttendance.find()
    .populate('student', 'name email')
    .sort({ timestamp: -1 });
  res.json(records);
};

const addFoodItem = async (req, res) => {
  const { mealType, item } = req.body;
  const newItem = new FoodMenu({ mealType, item });
  await newItem.save();
  res.json({ message: 'Item added to menu' });
};

const deleteFoodItem = async (req, res) => {
  const { id } = req.params;
  await FoodMenu.findByIdAndDelete(id);
  res.json({ message: 'Item deleted from menu' });
};

const getMenuItems = async (req, res) => {
  const items = await FoodMenu.find();
  res.json(items);
};

const postNotice = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newNotice = new Notice({ title, content });
    await newNotice.save();
    res.status(201).json({ message: 'Notice posted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to post notice', error: error.message });
  }
};


const getAllPayments = async (req, res) => {
  const payments = await Payment.find().populate('student', 'name email');
  res.json(payments);
};
const getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notices', error: err.message });
  }
};

// --- Student management ---
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('user', 'name email').populate('room', 'roomNumber');
    // map to include room number
    const out = students.map(s => ({ id: s._id, name: s.name || s.user?.name, email: s.email || s.user?.email, room: s.room ? s.room.roomNumber : null, approved: s.approved }));
    res.json(out);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching students', error: err.message });
  }
};

const getPendingStudents = async (req, res) => {
  try {
    const pending = await Student.find({ approved: false }).populate('user', 'name email');
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching pending students', error: err.message });
  }
};

const approveStudent = async (req, res) => {
  try {
    const { id } = req.params; // student id
    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    student.approved = true;
    await student.save();
    res.json({ message: 'Student approved' });
  } catch (err) {
    res.status(500).json({ message: 'Error approving student', error: err.message });
  }
};

const rejectStudent = async (req, res) => {
  try {
    const { id } = req.params; // student id
    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    // remove linked User as well
    await User.findByIdAndDelete(student.user);
    await Student.findByIdAndDelete(id);
    res.json({ message: 'Student registration rejected and removed' });
  } catch (err) {
    res.status(500).json({ message: 'Error rejecting student', error: err.message });
  }
};

const adminAddStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const { roomId } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });
    const bcrypt = require('bcryptjs');
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role: 'student' });
    await user.save();
    const student = new Student({ user: user._id, name, email, approved: true });
    await student.save();

    // If roomId provided, attempt to assign student to room
    if (roomId) {
      const room = await Room.findById(roomId);
      if (!room) return res.status(404).json({ message: 'Room not found' });
      if (room.occupants.length >= room.capacity) return res.status(400).json({ message: 'Room is full' });
      // push student _id (Student model) as occupant
      if (!room.occupants.includes(student._id)) {
        room.occupants.push(student._id);
        await room.save();
      }
      student.room = room._id;
      await student.save();
    }
    res.status(201).json({ message: 'Student created' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating student', error: err.message });
  }
};

const adminDeleteStudent = async (req, res) => {
  try {
    const { id } = req.params; // student id
    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    await User.findByIdAndDelete(student.user);
    // remove student from any room occupants
    if (student.room) {
      const room = await Room.findById(student.room);
      if (room) {
        room.occupants = room.occupants.filter(o => o.toString() !== student._id.toString());
        await room.save();
      }
    }
    await Student.findByIdAndDelete(id);
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting student', error: err.message });
  }
};





module.exports = {
  getAllComplaints,
  updateComplaintStatus,
  getFoodAttendance,
  addFoodItem,
  deleteFoodItem,
  getMenuItems,
  postNotice,
  getAllPayments,
  postNotice,
  getAllNotices,
  // student management
  getAllStudents,
  getPendingStudents,
  approveStudent,
  rejectStudent,
  adminAddStudent,
  adminDeleteStudent
};

