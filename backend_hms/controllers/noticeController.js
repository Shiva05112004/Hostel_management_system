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

