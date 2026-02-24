import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import '../styles/adminRoomManager.css';

// Admin can add rooms and assign a room to a student by entering room number


const AdminRoomManager = () => {
  const [roomNumber, setRoomNumber] = useState('');
  const [capacity, setCapacity] = useState('');
  const token = localStorage.getItem('token');
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [assignRoomNumber, setAssignRoomNumber] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentRes, roomsRes] = await Promise.all([
          api.get('/admin/students'),
          api.get('/admin')
        ]);
        // only include students without a room assigned
        const allStudents = studentRes.data || [];
        const unassigned = allStudents.filter(s => !s.room);
        setStudents(unassigned);
        setRooms(roomsRes.data || []);
      } catch (err) {
        // ignore for now
      }
    };
    fetchData();
  }, []);

  const handleAddRoom = async () => {
    if (!roomNumber || !capacity) {
      toast.warn("All fields are required");
      return;
    }

    try {
      const res = await api.post('/room/admin/add-room', { roomNumber, capacity });
      toast.success(res.data.msg || 'Room added');
      setRoomNumber('');
      setCapacity('');
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to add room");
    }
  };

  const handleAssignRoom = async () => {
    if (!selectedStudent || !assignRoomNumber) return toast.warn('Select student and enter room number');
    try {
      const res = await api.post('/admin/assign-by-number', { studentId: selectedStudent, roomNumber: assignRoomNumber });
      toast.success(res.data.msg || 'Assigned');
      setSelectedStudent('');
      setAssignRoomNumber('');
      // refresh rooms and students
      const [studentRes, roomsRes] = await Promise.all([api.get('/admin/students'), api.get('/admin')]);
      setStudents(studentRes.data || []);
      setRooms(roomsRes.data || []);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Assign failed');
    }
  };

  return (
    <div className="room-manager"><div className='addroom'>
      <div>
      <h3>Add Room</h3>
      <input
        type="text"
        placeholder="Room Number"
        value={roomNumber}
        onChange={(e) => setRoomNumber(e.target.value)}
      />
      <input
        type="number"
        placeholder="Capacity"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
      />
      <button onClick={handleAddRoom}>Add Room</button>

      <hr style={{ margin: '16px 0' }} />
      </div>
      </div>
      <div className="assignroom">
      <h3>Assign Room to Student (by Room Number)</h3>
      <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}>
        <option value="">Select Student</option>
        {students.map(s => (
          <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
        ))}
      </select>
      {selectedStudent && (
        <div style={{ marginTop: 8 }}>
          <strong>Selected student:</strong> {students.find(s => s.id === selectedStudent)?.name || ''}
        </div>
      )}
      <input type="text" placeholder="Enter Room Number" value={assignRoomNumber} onChange={e => setAssignRoomNumber(e.target.value)} />
      <button onClick={handleAssignRoom}>Assign Room</button>

      <div style={{ marginTop: 20 }}>
        <h3>Rooms</h3>
        {rooms.length === 0 ? <p>No rooms.</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Room</th>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Capacity</th>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Occupants</th>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Available</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map(r => (
                <tr key={r._id}>
                  <td style={{ border: '1px solid #ddd', padding: 8 }}>{r.roomNumber}</td>
                  <td style={{ border: '1px solid #ddd', padding: 8 }}>{r.capacity}</td>
                  <td style={{ border: '1px solid #ddd', padding: 8 }}>
                    {(r.occupants || []).length === 0 ? '-' : (r.occupants || []).map(o => o.name || o).join(', ')}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: 8 }}>{Math.max(r.capacity - ((r.occupants || []).length), 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div></div>
  );
};

export default AdminRoomManager;
