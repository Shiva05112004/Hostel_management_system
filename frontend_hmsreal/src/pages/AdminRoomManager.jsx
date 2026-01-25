import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/adminRoomManager.css';


const AdminRoomManager = () => {
  const [roomNumber, setRoomNumber] = useState('');
  const [capacity, setCapacity] = useState('');
  const token = localStorage.getItem('token');

  const handleAddRoom = async () => {
    if (!roomNumber || !capacity) {
      toast.warn("All fields are required");
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/room/admin/add-room',
        { roomNumber, capacity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.msg);
      setRoomNumber('');
      setCapacity('');
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to add room");
    }
  };

  return (
    <div className="room-manager">
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
    </div>
  );
};

export default AdminRoomManager;
