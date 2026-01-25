const Room = require("../models/Room");
const Student = require("../models/Student");

const assignRoomToStudent = async (req, res) => {
  try {
    const { studentId, roomId } = req.body;

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ msg: "Room not found" });

    if (room.occupants.length >= room.capacity) {
      return res.status(400).json({ msg: "Room is full" });
    }

    // Add student to room occupants
    room.occupants.push(studentId);
    await room.save();

    // Assign room to student
    const student = await Student.findById(studentId);
    student.room = room._id;
    await student.save();

    res.status(200).json({ msg: "Room assigned successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


const addRoom = async (req, res) => {
  try {
    const { roomNumber, capacity } = req.body;

    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).json({ msg: "Room already exists" });
    }

    const newRoom = new Room({ roomNumber, capacity, occupants: [] });
    await newRoom.save();

    res.status(201).json({ msg: "Room added successfully", room: newRoom });
  } catch (error) {
    console.error("Add room error:", error);
    res.status(500).json({ msg: "Server error while adding room" });
  }
};

module.exports = {
  assignRoomToStudent,
  addRoom,
};

// const Room = require("../models/Room");
// const Student = require("../models/Student");

// exports.assignRoomToStudent = async (req, res) => {
//   try {
//     const { studentId, roomId } = req.body;

//     const room = await Room.findById(roomId);
//     if (!room) return res.status(404).json({ msg: "Room not found" });

//     if (room.occupants.length >= room.capacity) {
//       return res.status(400).json({ msg: "Room is full" });
//     }

//     // Add student to room occupants
//     room.occupants.push(studentId);
//     await room.save();

//     // Assign room to student
//     const student = await Student.findById(studentId);
//     student.room = room._id;
//     await student.save();

//     res.status(200).json({ msg: "Room assigned successfully" });
//   } catch (err) {
//     res.status(500).json({ msg: "Server error" });
//   }
// };
