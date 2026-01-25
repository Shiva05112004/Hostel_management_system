import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AssignRoom = () => {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');

  const token = localStorage.getItem('token');
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // Fetch students and rooms
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentRes, roomRes] = await Promise.all([
          axios.get('http://localhost:5000/api/students', { headers }),
          axios.get('http://localhost:5000/api/rooms', { headers })
        ]);
        setStudents(studentRes.data);
        setRooms(roomRes.data);
      } catch (error) {
        toast.error('Failed to load students or rooms');
      }
    };
    fetchData();
  }, []);

  const handleAssign = async () => {
    if (!selectedStudent || !selectedRoom) {
      toast.error('Please select both student and room');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/rooms/assign',
        { studentId: selectedStudent, roomId: selectedRoom },
        { headers }
      );
      toast.success('Room assigned successfully');
      setSelectedStudent('');
      setSelectedRoom('');
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Room assignment failed');
    }
  };

  return (
    <div className="assign-room">
      <ToastContainer />
      <h2>Assign Room to Student</h2>

      <div>
        <label>Student:</label>
        <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
          <option value="">Select Student</option>
          {students.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Room:</label>
        <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
          <option value="">Select Room</option>
          {rooms.map((r) => (
            <option key={r._id} value={r._id}>
              Room {r.roomNumber} (Capacity: {r.capacity}, Occupants: {r.occupants.length})
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleAssign}>Assign Room</button>
    </div>
  );
};

export default AssignRoom;
