const express = require('express');
const router = express.Router();

// Import controller functions
const {
  markAttendance,
  getAllAttendance
} = require('../controllers/foodAttendanceController');

// Import middleware for auth
const {
  verifyToken,
  isAdmin
} = require('../middleware/authMiddleware');

// @route   POST /api/food-attendance/mark
// @desc    Student marks meal attendance
// @access  Private (Student)
router.post('/mark', verifyToken, markAttendance);

// @route   GET /api/food-attendance/all
// @desc    Admin views all attendance records
// @access  Private (Admin only)
router.get('/all', verifyToken, isAdmin, getAllAttendance);

module.exports = router;



// const express = require('express');
// const { markAttendance, getAllAttendance } = require('../controllers/foodController');
// const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// const router = express.Router();

// router.post('/mark', verifyToken, markAttendance);
// router.get('/all', verifyToken, isAdmin, getAllAttendance);

// module.exports = router;
