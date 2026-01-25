const Notice = require('../models/Notice');

// Add Notice (Admin only)
exports.addNotice = async (req, res) => {
  try {
    const { title, message } = req.body;

    // Validate required fields
    if (!title || !message) {
      return res.status(400).json({ msg: "Title and message are required." });
    }

    // Ensure req.user exists and has admin role
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ msg: "Admin access required." });
    }

    const createdBy = req.user.id;

    const newNotice = new Notice({ title, message, createdBy });
    await newNotice.save();

    res.status(201).json({ msg: "Notice posted successfully", notice: newNotice });
  } catch (err) {
    console.error("Error adding notice:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all notices (visible to all users)
exports.getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 });
    res.status(200).json(notices);
  } catch (err) {
    console.error("Error getting notices:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// const Notice = require('../models/Notice');

// // Add Notice (Admin only)
// exports.addNotice = async (req, res) => {
//   try {
//     const { title, message } = req.body;
//     const createdBy = req.user?.role === 'admin' ? req.user.id : 'unknown';

//     const newNotice = new Notice({ title, message, createdBy });
//     await newNotice.save();

//     res.status(201).json({ msg: "Notice posted successfully", notice: newNotice });
//   } catch (err) {
//     res.status(500).json({ msg: "Server error" });
//   }
// };

// // Get all notices (visible to all users)
// exports.getNotices = async (req, res) => {
//   try {
//     const notices = await Notice.find().sort({ date: -1 });
//     res.status(200).json(notices);
//   } catch (err) {
//     res.status(500).json({ msg: "Server error" });
//   }
// };
// const Notice = require('../models/Notice');

// // Admins can post notices
// exports.postNotice = async (req, res) => {
//   if (req.user.role !== 'admin') {
//     return res.status(403).json({ message: 'Only admin can post notices' });
//   }

//   const { title, description } = req.body;

//   if (!title || !description) {
//     return res.status(400).json({ message: 'Title and description are required' });
//   }

//   try {
//     const newNotice = new Notice({
//       title,
//       description,
//       postedBy: req.user.id,
//     });

//     await newNotice.save();
//     res.status(201).json({ message: 'Notice posted successfully', newNotice });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error while posting notice' });
//   }
// };

// // Admins and Students can fetch notices
// exports.getAllNotices = async (req, res) => {
//   try {
//     const notices = await Notice.find().sort({ createdAt: -1 });
//     res.json(notices);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error while fetching notices' });
//   }
// };

// const Notice = require('../models/Notice');

// // Admins can post notices
// exports.postNotice = async (req, res) => {
//   try {
//     const { title, description } = req.body;

//     if (!title || !description) {
//       return res.status(400).json({ message: 'Title and description are required.' });
//     }

//     const notice = new Notice({ title, description });
//     await notice.save();
//     res.status(201).json({ message: 'Notice added successfully', notice });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Everyone can fetch notices
// exports.getAllNotices = async (req, res) => {
//   try {
//     const notices = await Notice.find().sort({ date: -1 });
//     res.json(notices);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // controllers/noticeController.js

// const Notice = require('../models/Notice');
// const adminAuth = require('../middleware/adminAuth');  // Import the adminAuth middleware

// // Admins can post notices
// exports.postNotice = [adminAuth, async (req, res) => {  // Apply adminAuth as a middleware
//   try {
//     const notice = new Notice(req.body);
//     await notice.save();
//     res.status(201).json(notice);
//   } catch (err) {
//     res.status(500).json({ msg: "Server error" });
//   }
// }];

// // Students and admins can view notices, sorted by date
// exports.getAllNotices = async (req, res) => {
//   try {
//     const notices = await Notice.find().sort({ date: -1 });  // Sorting by date, newest first
//     res.json(notices);
//   } catch (err) {
//     res.status(500).json({ msg: "Server error" });
//   }
// };



