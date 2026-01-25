
const express = require('express');
const router =express.Router();

const verifyToken = require('../middleware/authMiddleware');
const Room = require('../models/Room');
const Notice = require('../models/Notice');
const Payment = require('../models/Payment');


const {

//  getStudents ,
  getStudentComplaints,
} = require('../controllers/complaintController');

// ✅ Rooms
router.get('/rooms', verifyToken, async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// ✅ Notices
router.get('/notices', verifyToken, async (req, res) => {
  try {
    const notices = await Notice.find();
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notices' });
  }
});

// ✅ Payments
router.get('/payments', verifyToken, async (req, res) => {
  try {
    const payments = await Payment.find({ studentId: req.user.id });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// ✅ Complaints
router.post('/complaints', verifyToken, createComplaint);
router.get('/complaints', verifyToken, getStudentComplaints);

// router.get('/students', verifyToken, getStudents);
// router. getStudents = async (req, res) => {
//   try {
//     // Dummy or actual DB logic
//     res.status(200).json({ message: "All students fetched successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

module.exports = router;
// const express = require('express');
// const router = express.Router();

// const verifyToken = require('../middleware/authMiddleware');
// const Room = require('../models/Room1');
// const Notice = require('../models/Notice');
// const Payment = require('../models/Payment');

// const {
//   createComplaint,
//   getStudentComplaints,
// } = require('../controllers/complaintController');




// // ✅ Rooms
// router.get('/rooms', verifyToken, async (req, res) => {
//   try {
//     const rooms = await Room.find();
//     res.json(rooms);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch rooms' });
//   }
// });

// // ✅ Notices
// router.get('/notices', verifyToken, async (req, res) => {
//   try {
//     const notices = await Notice.find();
//     res.json(notices);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch notices' });
//   }
// });

// // ✅ Payments
// router.get('/payments', verifyToken, async (req, res) => {
//   try {
//     const payments = await Payment.find({ studentId: req.user.id });
//     res.json(payments);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch payments' });
//   }
// });
// router.post('/complaints', verifyToken, createComplaint);
// router.get('/complaints', verifyToken, getStudentComplaints);

// module.exports = router;






// const express = require('express');



// const router = express.Router();
// const verifyToken = require('../middleware/authMiddleware');
// const Room = require('../models/Room1');
// const Notice = require('../models/Notice');
// const Complaint = require('../models/Complaint');
// const Payment = require('../models/Payment');


// const {
//   createComplaint,
//   getStudentComplaints,
// } = require('../controllers/complaintController');





// // ✅ Student Routes

// // Complaints
// router.post('/complaints', verifyToken, createComplaint); // use controller function
// router.get('/complaints', verifyToken, getStudentComplaints);

// // Rooms
// router.get('/rooms', verifyToken, async (req, res) => {
//   try {
//     const rooms = await Room.find();
//     res.json(rooms);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch rooms' });
//   }
// });

// // Notices
// router.get('/notices', verifyToken, async (req, res) => {
//   try {
//     const notices = await Notice.find();
//     res.json(notices);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch notices' });
//   }
// });

// // Payments
// router.get('/payments', verifyToken, async (req, res) => {
//   try {
//     const payments = await Payment.find({ studentId: req.user.id });
//     res.json(payments);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch payments' });
//   }
// });

// module.exports = router;




