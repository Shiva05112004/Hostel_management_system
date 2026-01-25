const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  occupants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }] // Link to Student model
});
module.exports = mongoose.models.Room || mongoose.model("Room", roomSchema);

// import mongoose from 'mongoose';

// const roomSchema = new mongoose.Schema({
//   roomNumber: String,
//   isOccupied: Boolean,
// });

// export default mongoose.model('Room', roomSchema);
