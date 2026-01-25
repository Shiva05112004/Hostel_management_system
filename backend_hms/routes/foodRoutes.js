const express = require('express');
const {
  markAttendance,
  getAllAttendance,
  addMeal,
  deleteMeal,
  getAllMeals,
  getAllMealsForStudents,
  getTodayMeal,
  getAttendanceByMealAndDate
} = require('../controllers/foodController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Student: Mark attendance
router.post('/attendance', verifyToken, markAttendance);

// Admin: Get attendance by date and mealType
router.get('/attendance', verifyToken, isAdmin, getAllAttendance);

router.get('/attending/:mealType/:date', verifyToken, getAttendanceByMealAndDate);
// Admin: Add meal
router.post('/add', verifyToken, isAdmin, addMeal);

// Admin: Delete meal
router.delete('/admin/delete-meal/:mealType/:date', verifyToken, isAdmin, deleteMeal);
router.get('/admin/all-meals', verifyToken, isAdmin, getAllMeals);
// routes/foodRoutes.js
router.get('/meals', verifyToken, getAllMealsForStudents);
router.get('/today-meal/:mealType/:date', verifyToken, getTodayMeal);

module.exports = router;

// const express = require('express');
// const Food = require('../models/Food');
// const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
// const sendSMS = require('../utils/sendSMS');

// const router = express.Router();

// // Utility: Validate YYYY-MM-DD format
// function isValidDateFormat(date) {
//   return /^\d{4}-\d{2}-\d{2}$/.test(date);
// }

// // 🧑‍🎓 Student: Mark food attendance
// router.post('/attendance', verifyToken, async (req, res) => {
//   try {
//     const { mealType } = req.body;
//     const today = new Date().toISOString().split('T')[0];

//     let record = await Food.findOne({ mealType, date: today });

//     if (!record) {
//       record = new Food({ mealType, date: today, attending: [] });
//     }

//     const alreadyMarked = record.attending.some(a => a.studentId.equals(req.user.id));
//     if (alreadyMarked) {
//       return res.status(400).json({ message: 'Attendance already marked for today.' });
//     }

//     record.attending.push({ studentId: req.user.id });
//     await record.save();

//     await sendSMS(`Food attendance updated: ${mealType} on ${today}`);
//     res.json({ message: 'Attendance recorded successfully.' });
//   } catch (err) {
//     console.error('Error recording attendance:', err);
//     res.status(500).json({ message: 'Server error while recording attendance.' });
//   }
// });

// // 🧑‍💼 Admin: Get attendance by date and mealType
// router.get('/attendance', verifyToken, isAdmin, async (req, res) => {
//   try {
//     const { date, mealType } = req.query;

//     if (!date || !isValidDateFormat(date)) {
//       return res.status(400).json({ message: 'Invalid or missing date. Use YYYY-MM-DD format.' });
//     }

//     const filter = { date };
//     if (mealType) filter.mealType = mealType;

//     const records = await Food.find(filter).populate('attending.studentId', 'name email');

//     res.json(records);
//   } catch (err) {
//     console.error('Error fetching attendance:', err);
//     res.status(500).json({ message: 'Server error while fetching attendance.' });
//   }
// });

// // 🧑‍💼 Admin: Add a new meal record manually (optional)
// router.post('/add', verifyToken, isAdmin, async (req, res) => {
//   try {
//     const { mealType, date } = req.body;

//     if (!mealType || !isValidDateFormat(date)) {
//       return res.status(400).json({ message: 'Invalid mealType or date format.' });
//     }

//     const exists = await Food.findOne({ mealType, date });
//     if (exists) {
//       return res.status(400).json({ message: 'Meal record already exists for this date.' });
//     }

//     const newMeal = new Food({ mealType, date, attending: [] });
//     await newMeal.save();

//     res.status(201).json({ message: 'Meal record added.', newMeal });
//   } catch (err) {
//     console.error('Error adding meal:', err);
//     res.status(500).json({ message: 'Server error while adding meal.' });
//   }
// });

// // 🧑‍💼 Admin: Delete a meal record
// router.delete('/delete/:id', verifyToken, isAdmin, async (req, res) => {
//   try {
//     const meal = await Food.findByIdAndDelete(req.params.id);
//     if (!meal) {
//       return res.status(404).json({ message: 'Meal not found.' });
//     }

//     res.json({ message: 'Meal deleted successfully.' });
//   } catch (err) {
//     console.error('Error deleting meal:', err);
//     res.status(500).json({ message: 'Server error while deleting meal.' });
//   }
// });

// module.exports = router;
//  //before that big
