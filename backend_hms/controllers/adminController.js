const Complaint = require('../models/Complaint');
const FoodMenu = require('../models/FoodMenu');
const FoodAttendance = require('../models/FoodAttendance');
const Notice = require('../models/Notice');
const Payment = require('../models/Payment');


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
  getAllNotices
};

