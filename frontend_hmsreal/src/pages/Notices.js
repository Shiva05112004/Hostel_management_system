import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Notices.css'; // 👈 Import the CSS file

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/notices/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotices(res.data);
      } catch (err) {
        console.error("Error fetching notices", err);
      }
    };

    fetchNotices();
  }, [token]);

  return (
    <div className="notices">
      <h3>📢 Notices</h3>
      {notices.length === 0 ? (
        <p>No notices yet.</p>
      ) : (
        notices.map((notice, idx) => (
          <div key={idx} className="notice-card">
            <h4>{notice.title}</h4>
            <p>{notice.message}</p>
            <small>Posted on: {new Date(notice.date).toLocaleDateString()}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default Notices;