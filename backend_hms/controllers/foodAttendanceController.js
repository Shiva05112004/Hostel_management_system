const Attendance = require('../models/FoodAttendance');

// Student marks attendance
exports.markAttendance = async (req, res) => {
  try {
    console.log("Body:", req.body);
console.log("User ID:", req.user.id);
    const { mealType } = req.body;
    const attendance = new Attendance({
      studentId: req.user.id,
      mealType,
      date: new Date(),
    });
    await attendance.save();
    res.status(201).json({ message: 'Attendance marked', attendance });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};



// Admin views all attendance
exports.getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find().populate('studentId', 'name email','name');
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
