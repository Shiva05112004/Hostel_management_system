const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: String,
    email: { type: String },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', default: null },
    approved: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
