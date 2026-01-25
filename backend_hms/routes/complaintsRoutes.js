const express = require('express');
const {
  submitComplaint,
  updateComplaintStatus,
  getAllComplaints,
  getStudentComplaints
} = require('../controllers/complaintController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware'); // ✅ include isAdmin

const router = express.Router();

// Student: Submit complaint
router.post('/', verifyToken, submitComplaint);

// Student: Get own complaints
router.get('/student', verifyToken, getStudentComplaints);

// Admin: Get all complaints
router.get('/', verifyToken, isAdmin, getAllComplaints);

// Admin: Update complaint status
router.put('/:id', verifyToken, isAdmin, updateComplaintStatus);

module.exports = router;

// const express = require('express');
// const { submitComplaint, updateComplaintStatus } = require('../controllers/complaintController');
// const verifyToken = require('../middleware/authMiddleware');

// const router = express.Router();

// router.post('/', verifyToken, submitComplaint);
// router.put('/:id', verifyToken, updateComplaintStatus); // ✅ Add this
// // Admin: Get all complaints
// router.get('/', verifyToken, isAdmin, getAllComplaints);

// // Admin: Update complaint status
// router.put('/:id', verifyToken, isAdmin, updateComplaintStatus);


// module.exports = router;

// // const express = require('express');
// // const { createComplaint } = require('../controllers/complaintController');
// // const verifyToken = require('../middleware/authMiddleware');

// // const router = express.Router();

// // // POST /api/complaints
// // router.post('/', verifyToken, createComplaint);

// // module.exports = router;

// // const express = require('express');
// // const { createComplaint } = require('../controllers/complaintController');
// // const verifyToken = require('../middleware/authMiddleware');

// // const router = express.Router();

// // router.post('/', verifyToken, createComplaint);

// // module.exports = router;
// // const express = require("express");
// // const router = express.Router();
// // const Complaint = require("../models/Complaint");
// // const authMiddleware = require("../middleware/authMiddleware");

// // // Submit a complaint
// // router.post("/", authMiddleware, async (req, res) => {
// //   try {
// //     const complaint = new Complaint({ ...req.body, student: req.user.id });
// //     await complaint.save();
// //     res.status(201).json(complaint);
// //   } catch (err) {
// //     res.status(500).json({ msg: "Server error" });
// //   }
// // });

// // // Get all complaints (admin only)
// // router.get("/", authMiddleware, async (req, res) => {
// //   try {
// //     const complaints = await Complaint.find().populate("student");
// //     res.json(complaints);
// //   } catch (err) {
// //     res.status(500).json({ msg: "Server error" });
// //   }
// // });

// // // Update complaint status
// // router.put("/:id", authMiddleware, async (req, res) => {
// //   try {
// //     const complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true });
// //     res.json(complaint);
// //   } catch (err) {
// //     res.status(500).json({ msg: "Server error" });
// //   }
// // });

// // module.exports = router;
