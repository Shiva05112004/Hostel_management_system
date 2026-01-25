const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["paid", "unpaid"],
    default: "unpaid",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Fix for OverwriteModelError
module.exports = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

// const mongoose = require('mongoose');

// const paymentSchema = new mongoose.Schema({
//   student: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   amount: {
//     type: Number,
//     required: true,
//   },
//   date: {
//     type: Date,
//     default: Date.now,
//   },
//   status: {
//     type: String,
//     enum: ['paid', 'pending'],
//     default: 'pending',
//   }
// });

// module.exports = mongoose.model('Payment', paymentSchema);

