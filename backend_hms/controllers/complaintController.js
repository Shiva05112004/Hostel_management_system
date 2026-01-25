
const Complaint = require('../models/Complaint');

// ✅ Student: Submit Complaint (renamed from createComplaint)
const submitComplaint = async (req, res) => {
  try {
    const { title, description } = req.body;

    const newComplaint = new Complaint({
      student: req.user.id,
      title,
      description,
      status: 'Pending',
    });

    const savedComplaint = await newComplaint.save();
    res.status(201).json(savedComplaint);
  } catch (error) {
    console.error("Error creating complaint:", error);
    res.status(500).json({ message: 'Server error while creating complaint' });
  }
};

// Other functions remain unchanged
const getStudentComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ student: req.user.id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    console.error("Error fetching student complaints:", error);
    res.status(500).json({ message: 'Server error while fetching complaints' });
  }
};

const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(updatedComplaint);
  } catch (error) {
    console.error("Error updating complaint:", error);
    res.status(500).json({ message: 'Server error while updating complaint' });
  }
};

const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('student', 'name email').sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    console.error("Error fetching all complaints:", error);
    res.status(500).json({ message: 'Server error while fetching all complaints' });
  }
};

// ✅ Export with new name
module.exports = {
  submitComplaint,
  getStudentComplaints,
  updateComplaintStatus,
  getAllComplaints,
};
// const Complaint = require('../models/Complaint');


// // ✅ Student: Create Complaint
// const createComplaint = async (req, res) => {
//   try {
//     const { title, description } = req.body;

//     const newComplaint = new Complaint({
//       student: req.user.id, // token must attach student ID
//       title,
//       description,
//       status: 'Pending',
//     });

//     const savedComplaint = await newComplaint.save();
//     res.status(201).json(savedComplaint);
//   } catch (error) {
//     console.error("Error creating complaint:", error);
//     res.status(500).json({ message: 'Server error while creating complaint' });
//   }
// };

// // ✅ Student: Get Own Complaints
// const getStudentComplaints = async (req, res) => {
//   try {
//     const complaints = await Complaint.find({ student: req.user.id }).sort({ createdAt: -1 });
//     res.json(complaints);
//   } catch (error) {
//     console.error("Error fetching student complaints:", error);
//     res.status(500).json({ message: 'Server error while fetching complaints' });
//   }
// };

// // ✅ Admin: Update Complaint Status
// const updateComplaintStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     const updatedComplaint = await Complaint.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true }
//     );

//     if (!updatedComplaint) {
//       return res.status(404).json({ message: 'Complaint not found' });
//     }

//     res.json(updatedComplaint);
//   } catch (error) {
//     console.error("Error updating complaint:", error);
//     res.status(500).json({ message: 'Server error while updating complaint' });
//   }
// };

// // ✅ Admin: Get All Complaints
// const getAllComplaints = async (req, res) => {
//   try {
//     const complaints = await Complaint.find().populate('student', 'name email').sort({ createdAt: -1 });
//     res.json(complaints);
//   } catch (error) {
//     console.error("Error fetching all complaints:", error);
//     res.status(500).json({ message: 'Server error while fetching all complaints' });
//   }
// };

// module.exports = {
//   createComplaint,
//   getStudentComplaints,
//   updateComplaintStatus,
//   getAllComplaints,
// };


// const Complaint = require('../models/Complaint');

// const createComplaint = async (req, res) => {
//   try {
//     const { title, description } = req.body;

//     const newComplaint = new Complaint({
//       student: req.user.id, // Set by middleware
//       title,
//       description
//     });

//     const savedComplaint = await newComplaint.save();
//     res.status(201).json(savedComplaint);
//   } catch (error) {
//     console.error("Error creating complaint:", error);
//     res.status(500).json({ message: 'Server error while creating complaint' });
//   }
// };

// module.exports = { createComplaint };



// const Complaint = require("../models/Complaint");

// exports.submitComplaint = async (req, res) => {
//   try {
//     const complaint = new Complaint({ ...req.body, student: req.user.id });
//     await complaint.save();
//     res.status(201).json(complaint);
//   } catch (err) {
//     res.status(500).json({ msg: "Server error" });
//   }
// };

// exports.getAllComplaints = async (req, res) => {
//   try {
//     const complaints = await Complaint.find().populate("student");
//     res.json(complaints);
//   } catch (err) {
//     res.status(500).json({ msg: "Server error" });
//   }
// };

// exports.updateComplaintStatus = async (req, res) => {
//   try {
//     const complaint = await Complaint.findByIdAndUpdate(
//       req.params.id,
//       { status: req.body.status },
//       { new: true }
//     );
//     res.json(complaint);
//   } catch (err) {
//     res.status(500).json({ msg: "Server error" });
//   }
// };
