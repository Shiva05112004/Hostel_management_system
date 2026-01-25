const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    required: true,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;

// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   password: String,
//   role: { type: String, enum: ['student', 'admin'], default: 'student' },
// });

// export default mongoose.model('User', userSchema);

// // const mongoose = require("mongoose");

// // const userSchema = new mongoose.Schema({
// //   name: { type: String, required: true },
// //   email: { type: String, required: true, unique: true },
// //   password: { type: String, required: true },
// //   role: { type: String, enum: ["student", "admin", "warden"], required: true },
// // }, { timestamps: true });

// // module.exports = mongoose.model("User", userSchema);

// // /*const mongoose = require("mongoose");
// // const UserSchema = new mongoose.Schema({
// //   name: String,
// //   email: { type: String, unique: true },
// //   password: String,
// //   role: { type: String, enum: ["admin", "student"], default: "student" },
// //   room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
// // });
// // module.exports = mongoose.model("User", UserSchema);
// // */