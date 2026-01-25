import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Room.css";

const AvailableRooms = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/room/available", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRooms(res.data);
    };
    fetchRooms();
  }, []);

  return (
    <div className="available-rooms-container">
      <h2 className="available-rooms-title">Available Rooms</h2>
      <ul className="available-rooms-list">
        {rooms.map(room => (
          <li className="available-room-item" key={room._id}>
            Room {room.roomNumber} – {room.available} spot(s) left
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AvailableRooms;
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const AvailableRooms = () => {
//   const [rooms, setRooms] = useState([]);

//   useEffect(() => {
//     const fetchRooms = async () => {
//       const token = localStorage.getItem("token");
//       const res = await axios.get("http://localhost:5000/api/room/available", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setRooms(res.data);
//     };
//     fetchRooms();
//   }, []);

//   return (
//     <div>
//       <h2>Available Rooms</h2>
//       <ul>
//         {rooms.map(room => (
//           <li key={room._id}>
//             Room {room.roomNumber} – {room.available} spot(s) left
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default AvailableRooms;

