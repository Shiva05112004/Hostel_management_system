const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
  createdBy: { type: String } // Admin name or ID
});

module.exports = mongoose.model('Notice', noticeSchema);
// const mongoose = require('mongoose');

// const noticeSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true
//   },
//   description: {
//     type: String,
//     required: true
//   },
//   date: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Prevent OverwriteModelError
// module.exports = mongoose.models.Notice || mongoose.model('Notice', noticeSchema);


// const mongoose = require('mongoose');

// const noticeSchema = new mongoose.Schema({
//   message: {
//     type: String,
//     required: true
//   },
//   postedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
//   date: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('Notice', noticeSchema);

// // models/Notice.js

// const mongoose = require('mongoose');

// const noticeSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   date: { type: Date, default: Date.now },  // Date when the notice is posted
// });

// module.exports = mongoose.model('Notice', noticeSchema);

// const mongoose = require('mongoose');

// const noticeSchema = new mongoose.Schema({
//   title: String,
//   content: String,
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('Notice', noticeSchema);
