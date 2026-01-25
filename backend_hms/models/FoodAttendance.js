const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mealType: { type: String, required: true }, // Breakfast, Lunch, etc.
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('FoodAttendance', attendanceSchema);

// const mongoose = require('mongoose');

// const foodAttendanceSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snacks'] },
//   date: String
// });

// module.exports = mongoose.model('FoodAttendance', foodAttendanceSchema);
