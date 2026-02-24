import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/Room.css";

const AvailableRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [roommatesByRoom, setRoommatesByRoom] = useState({});
  const [loadingRoommates, setLoadingRoommates] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get("/room/available");
        setRooms(res.data);
      } catch (err) {
        console.error("Failed to fetch rooms", err);
      }
    };
    fetchRooms();
  }, []);

  const viewRoommates = async (roomNumber) => {
    setLoadingRoommates(roomNumber);
    try {
      const res = await api.get(`/room/number/${encodeURIComponent(roomNumber)}`);
      setRoommatesByRoom(prev => ({ ...prev, [roomNumber]: res.data.roommates || [] }));
    } catch (err) {
      console.error("Failed to fetch roommates for room", roomNumber, err);
      setRoommatesByRoom(prev => ({ ...prev, [roomNumber]: [] }));
    } finally {
      setLoadingRoommates(null);
    }
  };

  return (
    <div className="available-rooms-container">
      <h2 className="available-rooms-title">Available Rooms</h2>
      <ul className="available-rooms-list">
        {rooms.map(room => (
          <li className="available-room-item" key={room._id}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <strong>Room {room.roomNumber}</strong> — Capacity: {room.capacity}
              </div>
              <div>
                <button onClick={() => viewRoommates(room.roomNumber)}>
                  {loadingRoommates === room.roomNumber ? 'Loading...' : 'View Roommates'}
                </button>
              </div>
            </div>

            {roommatesByRoom[room.roomNumber] && (
              <div style={{ marginTop: 8 }}>
                <h5>Roommates</h5>
                {roommatesByRoom[room.roomNumber].length > 0 ? (
                  <ul>
                    {roommatesByRoom[room.roomNumber].map(r => (
                      <li key={r.id || r._id}>{r.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No roommates assigned.</p>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AvailableRooms;