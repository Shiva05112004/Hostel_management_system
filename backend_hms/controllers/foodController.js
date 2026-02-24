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
    // Emit real-time update via Socket.IO if available
    try {
      const io = req.app.get('io');
      if (io) {
        // Try to get student name from Student model
        const Student = require('../models/Student');
        let studentName = null;
        try {
          const studentDoc = await Student.findOne({ user: req.user.id }).select('name');
          if (studentDoc) studentName = studentDoc.name;
        } catch (e) {
          // ignore
        }

        const room = `attendance:${mealType}:${today}`;
        io.to(room).emit('attendanceUpdated', {
          mealType,
          date: today,
          student: { id: req.user.id, name: studentName }
        });
      }
    } catch (emitErr) {
      console.error('Error emitting attendance event:', emitErr);
    }

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
    // populate attending.studentId to include student name/email
    const record = await Food.findOne({ mealType, date }).populate('attending.studentId', 'name email');

    // Normalize attending entries to ensure student name/email are present
    const Student = require('../models/Student');
    const normalizedAttending = await Promise.all((record.attending || []).map(async (a) => {
      const sid = a.studentId;
      if (sid && typeof sid === 'object' && (sid.name || sid.email)) {
        return { studentId: { _id: sid._id, name: sid.name, email: sid.email } };
      }
      // sid may be an ObjectId or string; try to fetch Student
      try {
        const studentDoc = await Student.findById(sid).select('name email');
        if (studentDoc) return { studentId: { _id: studentDoc._id, name: studentDoc.name, email: studentDoc.email } };
      } catch (err) {
        // ignore
      }
      // fallback: return id only
      return { studentId: { _id: sid, name: null, email: null } };
    }));

    if (!record) {
      return res.status(404).json({ message: 'Meal not found for given type and date.' });
    }

    res.status(200).json({
      mealType: record.mealType,
      date: record.date,
      attending: normalizedAttending,
      description: record.description,
    });
  } catch (err) {
    console.error('Error fetching attendance:', err);
    res.status(500).json({ message: 'Server error while fetching attendance.' });
  }
};

// Admin: Return attendance CSV (download) or HTML preview when ?view=1
const getAttendanceCSV = async (req, res) => {
  const { mealType, date } = req.params;
  try {
    const record = await Food.findOne({ mealType, date }).populate('attending.studentId', 'name email');
    if (!record) return res.status(404).json({ message: 'Meal not found for given type and date.' });

    // Normalize attending
    const Student = require('../models/Student');
    const normalized = await Promise.all((record.attending || []).map(async (a, idx) => {
      const sid = a.studentId;
      if (sid && typeof sid === 'object' && (sid.name || sid.email)) {
        return { Serial: idx + 1, Name: sid.name || '', Email: sid.email || '', MealType: mealType, Date: date, FoodItem: record.description || '' };
      }
      try {
        const studentDoc = await Student.findById(sid).select('name email');
        if (studentDoc) return { Serial: idx + 1, Name: studentDoc.name || '', Email: studentDoc.email || '', MealType: mealType, Date: date, FoodItem: record.description || '' };
      } catch (e) {}
      return { Serial: idx + 1, Name: '', Email: '', MealType: mealType, Date: date, FoodItem: record.description || '' };
    }));

    const headers = ['Serial','Name','Email','MealType','Date','FoodItem'];
    const rows = normalized.map(r => headers.map(h => `"${String(r[h] || '').replace(/"/g, '""')}"`).join(','));
    const csvString = headers.join(',') + '\n' + rows.join('\n');

    if (req.query.view === '1') {
      // Render HTML preview table
      const table = `\n<table border="1" cellpadding="6" style="border-collapse:collapse;">\n<thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead>\n<tbody>\n${normalized.map(r=>`<tr>${headers.map(h=>`<td>${(r[h]||'')}</td>`).join('')}</tr>`).join('\n')}\n</tbody>\n</table>`;
      return res.send(`<!doctype html><html><head><meta charset="utf-8"><title>Attendance ${mealType} ${date}</title></head><body><h3>Attendance ${mealType} ${date}</h3>${table}</body></html>`);
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="Attendance_${mealType}_${date}.csv"`);
    res.send(csvString);
  } catch (err) {
    console.error('Error generating attendance CSV:', err);
    res.status(500).json({ message: 'Server error while generating CSV.' });
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
  getAttendanceCSV,
};
