
const Complaint = require('../models/Complaint');
const Student = require('../models/Student');

// ✅ Student: Submit Complaint (renamed from createComplaint)
const submitComplaint = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Find the Student document for the authenticated user
    const studentDoc = await Student.findOne({ user: req.user.id });
    if (!studentDoc) return res.status(400).json({ message: 'Student profile not found for this user' });

    const newComplaint = new Complaint({
      student: studentDoc._id,
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
    const studentDoc = await Student.findOne({ user: req.user.id });
    if (!studentDoc) return res.status(400).json({ message: 'Student profile not found for this user' });

    const complaints = await Complaint.find({ student: studentDoc._id }).sort({ createdAt: -1 });
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
    // Populate student -> room -> occupants (occupants populated with name and _id)
    const complaints = await Complaint.find()
      .populate({
        path: 'student',
        select: 'name email room',
        populate: {
          path: 'room',
          select: 'roomNumber occupants',
          populate: { path: 'occupants', select: 'name _id' }
        }
      })
      .sort({ createdAt: -1 });

    // Transform complaints to include student name/email and roomNumber (no roommates)
    const transformed = complaints.map(c => {
      const student = c.student || null;
      let roomNumber = null;
      if (student && student.room) {
        roomNumber = student.room.roomNumber;
      }

      return {
        _id: c._id,
        title: c.title,
        description: c.description,
        status: c.status,
        createdAt: c.createdAt,
        student: student ? { id: student._id, name: student.name, email: student.email } : null,
        roomNumber,
      };
    });

    res.json(transformed);
  } catch (error) {
    console.error("Error fetching all complaints:", error);
    res.status(500).json({ message: 'Server error while fetching all complaints' });
  }
};

const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Complaint.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Complaint not found' });
    res.json({ message: 'Complaint deleted' });
  } catch (error) {
    console.error('Error deleting complaint:', error);
    res.status(500).json({ message: 'Server error while deleting complaint' });
  }
};

// ✅ Export with new name
module.exports = {
  submitComplaint,
  getStudentComplaints,
  updateComplaintStatus,
  getAllComplaints,
  deleteComplaint,
};