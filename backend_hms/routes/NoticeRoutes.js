const express = require('express');
const router = express.Router();
const { addNotice, getNotices } = require('../controllers/noticeController');
const {isAdmin, verifyToken} = require('../middleware/authMiddleware');

router.post('/add',verifyToken, isAdmin, addNotice);     // Admin posts notice
router.get('/all', verifyToken, getNotices);     // All users fetch notices

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const { verifyToken } = require('../middleware/authMiddleware');
// const { postNotice, getAllNotices } = require('../controllers/noticeController');

// // Route: POST /api/notices/add → Admin adds notice
// router.post('/add', verifyToken, postNotice);

// // Route: GET /api/notices → Admin & Student view all notices
// router.get('/', verifyToken, getAllNotices);

// module.exports = router;
// ✅ VERY IMPORTANT

//after lunch
// // const express = require('express');
// const router = express.Router();
// const { postNotice, getAllNotices } = require('../controllers/noticeController');
// // const adminAuth = require('../middleware/authiddleware');
// const adminAuth = require('../middleware/auth'); 
// const Notice = require('../models/Notice');// generic auth middleware

// router.post('/add', adminAuth, postNotice);     // only admin can post
// router.get('/', async (req, res) => {
//   try {
//     const notices = await Notice.find().sort({ createdAt: -1 });
//     res.json(notices);
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });


// module.exports = router;

// const express = require('express');
// const Notice = require('../models/Notice');
// const verifyToken = require('../middleware/authMiddleware');


// const router = express.Router();

// // Admin: Add a new notification
// router.post('/add', verifyToken, async (req, res) => {
//   if (req.user.role !== 'admin') {
//     return res.status(403).json({ message: 'Only admin can post notifications' });
//   }

//   const { message } = req.body;

//   if (!message) return res.status(400).json({ message: 'Message is required' });

//   try {
//     const notification = new Notification({
//       message,
//       postedBy: req.user.id
//     });

//     await notification.save();
//     res.json({ message: 'Notification posted successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to post notification' });
//   }
// });

// // Public: Get all notifications
// router.get('/all', verifyToken, async (req, res) => {
//   try {
//     const notices = await Notification.find()
//       .sort({ date: -1 })
//       .populate('postedBy', 'name');

//     res.json(notices);
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching notifications' });
//   }
// });

// module.exports = router;
// //before notice fetch

