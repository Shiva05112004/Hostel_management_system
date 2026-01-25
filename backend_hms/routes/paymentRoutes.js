const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment"); // ✅ use this line only
const { verifyToken } = require("../middleware/authMiddleware");

// Example route
router.get("/", verifyToken, async (req, res) => {
  try {
    const payments = await Payment.find({ student: req.user.id });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});

module.exports = router;

//BEFORE PAYMENS
// // const express = require("express");
// const router = express.Router();
// const Payment = require("../models/Payment");
// const authMiddleware = require("../middleware/authMiddleware");

// // Add a payment
// router.post("/", authMiddleware, async (req, res) => {
//   try {
//     const payment = new Payment({ ...req.body, student: req.user.id });
//     await payment.save();
//     res.status(201).json(payment);
//   } catch (err) {
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// // Get payments for the logged-in student
// router.get("/my", authMiddleware, async (req, res) => {
//   try {
//     const payments = await Payment.find({ student: req.user.id });
//     res.json(payments);
//   } catch (err) {
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// // Get all payments (admin only)
// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     const payments = await Payment.find().populate("student");
//     res.json(payments);
//   } catch (err) {
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// module.exports = router;