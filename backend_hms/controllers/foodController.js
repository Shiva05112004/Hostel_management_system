const Food= require('../models/Food');
const sendSMS = require('../utils/sendSMS');

// ✅ Utility: Validate YYYY-MM-DD date format
function isValidDateFormat(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}
const formattedDate = new Date().toISOString().split('T')[0];


// 🧑‍🎓 Student: Mark attendance
const markAttendance = async (req, res) => {
  try {
    const { mealType } = req.body;
    const today = new Date().toISOString().split('T')[0];

    let record = await Food.findOne({ mealType, date: today });

    if (!record) {
      record = new Food({ mealType, date: today, attending: [] });
    }

    const alreadyMarked = record.attending.some(a => a.studentId.equals(req.user.id));
    if (alreadyMarked) {
      return res.status(400).json({ message: 'Attendance already marked for today.' });
    }

    record.attending.push({ studentId: req.user.id });
    await record.save();

    await sendSMS(`Food attendance updated: ${mealType} on ${today}`);
    res.json({ message: 'Attendance recorded successfully.' });
  } catch (err) {
    console.error('Error recording attendance:', err);
    res.status(500).json({ message: 'Server error while recording attendance.' });
  }
};

// 🧑‍💼 Admin: Get all attendance (optional filter by date and mealType)
const getAllAttendance = async (req, res) => {
  try {
    const { date, mealType } = req.query;

    if (!date || !isValidDateFormat(date)) {
      return res.status(400).json({ message: 'Invalid or missing date. Use YYYY-MM-DD format.' });
    }

    const filter = { date };
    if (mealType) filter.mealType = mealType;

    const records = await Food.find(filter).populate('attending.studentId', 'name email');
    res.json(records);
  } catch (err) {
    console.error('Error fetching attendance:', err);
    res.status(500).json({ message: 'Server error while fetching attendance.' });
  }
};

// 🧑‍💼 Admin: Add a meal record manually
const addMeal = async (req, res) => {
  try {
    const { mealType, date, description } = req.body;

    if (!mealType || !isValidDateFormat(date) || !description) {
      return res.status(400).json({ message: 'Invalid mealType, date format, or missing description.' });
    }

    const exists = await Food.findOne({ mealType, date });
    if (exists) {
      return res.status(400).json({ message: 'Meal record already exists for this date.' });
    }

    const newMeal = new Food({
      mealType,
      date,
      description,
      addedBy: req.user.name || 'Admin',
      attending: [],
    });

    await newMeal.save();

    res.status(201).json({ message: 'Meal record added.', newMeal });
  } catch (err) {
    console.error('Error adding meal:', err);
    res.status(500).json({ message: 'Server error while adding meal.' });
  }
};


// 🧑‍💼 Admin: Delete a meal record
const deleteMeal = async (req, res) => {
  const { mealType, date } = req.params;

  try {
    const meal = await Food.findOneAndDelete({ mealType, date });

    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    res.status(200).json({ message: 'Meal deleted successfully' });
  } catch (error) {
    console.error('Error deleting meal:', error);
    res.status(500).json({ message: 'Server error while deleting meal' });
  }
};

const getAllMeals = async (req, res) => {
  try {
    const meals = await Food.find().sort({ date: -1 });
    res.status(200).json(meals);
  } catch (err) {
    console.error('Error fetching meals:', err);
    res.status(500).json({ message: 'Failed to fetch meals' });
  }
};
const getAllMealsForStudents = async (req, res) => {
  try {
    const meals = await Food.find(); // or filter by date if needed
    res.status(200).json(meals);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
const getTodayMeal = async (req, res) => {
  try {
    const { mealType, date } = req.params;
    const meal = await Food.findOne({ mealType, date });

    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    res.status(200).json(meal);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
const getAttendanceByMealAndDate = async (req, res) => {
  const { mealType, date } = req.params;

  try {
    const record = await Food.findOne({ mealType, date });

    if (!record) {
      return res.status(404).json({ message: 'Meal not found for given type and date.' });
    }

    res.status(200).json({
      mealType: record.mealType,
      date: record.date,
      attending: record.attending,
      description: record.description,
    });
  } catch (err) {
    console.error('Error fetching attendance:', err);
    res.status(500).json({ message: 'Server error while fetching attendance.' });
  }
};


module.exports = {
  markAttendance,
  getAllAttendance,
  addMeal,
  deleteMeal,
getAllMeals,
getAllMealsForStudents ,
getTodayMeal,
getAttendanceByMealAndDate,

};

// before big
// const FoodAttendance = require('../models/FoodAttendance');

// // ✅ Student: Mark Attendance
// const markAttendance = async (req, res) => {
//   try {
//     const { mealType } = req.body;
//     const userId = req.user.id;

//     const mealTimes = {
//       breakfast: 8,
//       lunch: 13,
//       snacks: 17,
//       dinner: 20
//     };

//     if (!mealTimes[mealType]) {
//       return res.status(400).json({ message: 'Invalid meal type' });
//     }

//     const now = new Date();
//     const cutoffTime = new Date();
//     cutoffTime.setHours(mealTimes[mealType] - 4, 0, 0, 0); // 4 hours before meal

//     if (now > cutoffTime) {
//       return res.status(403).json({ message: `Too late to mark ${mealType} attendance.` });
//     }

//     const today = new Date().toDateString();

//     const existing = await FoodAttendance.findOne({
//       student: userId,
//       mealType,
//       date: today
//     });

//     if (existing) {
//       return res.status(400).json({ message: 'Already marked attendance for this meal today.' });
//     }

//     const attendance = new FoodAttendance({
//       student: userId,
//       mealType,
//       date: today
//     });

//     await attendance.save();
//     res.status(201).json({ message: 'Attendance marked successfully.' });
//   } catch (error) {
//     console.error("Error marking attendance:", error);
//     res.status(500).json({ message: 'Server error while marking attendance.' });
//   }
// };

// // ✅ Admin: Get All Attendance
// const getAllAttendance = async (req, res) => {
//   try {
//     const records = await FoodAttendance.find()
//       .populate('student', 'name email role')
//       .sort({ date: -1 });

//     res.status(200).json(records);
//   } catch (err) {
//     console.error("Error fetching attendance:", err);
//     res.status(500).json({ message: 'Error fetching attendance records' });
//   }
// };

// module.exports = {
//   markAttendance,
//   getAllAttendance,
// };

// const FoodAttendance = require('../models/FoodAttendance');

// // ✅ Student: Mark Attendance
// exports.markAttendance = async (req, res) => {
//   try {
//     const { mealType } = req.body;
//     const userId = req.user.id;

//     const mealTimes = {
//       breakfast: 8,
//       lunch: 13,
//       snacks: 17,
//       dinner: 20
//     };

//     if (!mealTimes[mealType]) {
//       return res.status(400).json({ message: 'Invalid meal type' });
//     }

//     const now = new Date();
//     const cutoffTime = new Date();
//     cutoffTime.setHours(mealTimes[mealType] - 4, 0, 0, 0); // 4 hours before meal

//     if (now > cutoffTime) {
//       return res.status(403).json({ message: `Too late to mark ${mealType} attendance.` });
//     }

//     const today = new Date().toDateString();

//     const existing = await FoodAttendance.findOne({
//       student: userId,
//       mealType,
//       date: today
//     });

//     if (existing) {
//       return res.status(400).json({ message: 'Already marked attendance for this meal today.' });
//     }

//     const attendance = new FoodAttendance({
//       student: userId,
//       mealType,
//       date: today
//     });

//     await attendance.save();
//     res.status(201).json({ message: 'Attendance marked successfully.' });
//   } catch (error) {
//     console.error("Error marking attendance:", error);
//     res.status(500).json({ message: 'Server error while marking attendance.' });
//   }
// };

// // ✅ Admin: Get All Attendance
// exports.getAllAttendance = async (req, res) => {
//   try {
//     const records = await FoodAttendance.find()
//       .populate('student', 'name email role')
//       .sort({ date: -1 });

//     res.status(200).json(records);
//   } catch (err) {
//     console.error("Error fetching attendance:", err);
//     res.status(500).json({ message: 'Error fetching attendance records' });
//   }
// };
