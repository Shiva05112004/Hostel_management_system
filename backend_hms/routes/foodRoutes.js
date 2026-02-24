const express = require('express');
const {
  markAttendance,
  getAllAttendance,
  addMeal,
  deleteMeal,
  getAllMeals,
  getAllMealsForStudents,
  getTodayMeal,
  getAttendanceByMealAndDate,
  getAttendanceCSV
} = require('../controllers/foodController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Student: Mark attendance
router.post('/attendance', verifyToken, markAttendance);

// Admin: Get attendance by date and mealType
router.get('/attendance', verifyToken, isAdmin, getAllAttendance);

router.get('/attending/:mealType/:date', verifyToken, getAttendanceByMealAndDate);
// Admin: CSV export / preview for attendance
router.get('/attending/:mealType/:date/csv', verifyToken, isAdmin, getAttendanceCSV);
// Admin: Add meal
router.post('/add', verifyToken, isAdmin, addMeal);

// Admin: Delete meal
router.delete('/admin/delete-meal/:mealType/:date', verifyToken, isAdmin, deleteMeal);
router.get('/admin/all-meals', verifyToken, isAdmin, getAllMeals);
// routes/foodRoutes.js
router.get('/meals', verifyToken, getAllMealsForStudents);
router.get('/today-meal/:mealType/:date', verifyToken, getTodayMeal);

module.exports = router;

