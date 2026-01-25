import React, { useEffect, useState } from "react";
import axios from "axios";

const MyRoom = () => {
  const [room, setRoom] = useState(null);

  useEffect(() => {
    const fetchMyRoom = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/room/myroom", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRoom(res.data);
    };
    fetchMyRoom();
  }, []);
  

  return (
    <div>
      <h2>My Room</h2>
      {room ? (
        <p>
          You are assigned to Room {room.roomNumber} (Capacity: {room.capacity})
        </p>
      ) : (
        <p>No room assigned yet.</p>
      )}
    </div>
  );
};

export default MyRoom;
