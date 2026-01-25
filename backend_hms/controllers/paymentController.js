const Payment = require("../models/Payment");

exports.addPayment = async (req, res) => {
  try {
    const payment = new Payment({ ...req.body, student: req.user.id });
    await payment.save();
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getStudentPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ student: req.user.id });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("student");
    res.json(payments);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
