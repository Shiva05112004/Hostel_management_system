// components/Dashboard.js
import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import '../styles/Dashboard.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
// admin components are rendered inline

const Dashboard = () => {
  const [stats, setStats] = useState({ rooms: [], notices: [], payments: [] });
  // no sidebar toggle used
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (role === 'student') {
          const [roomsRes, noticesRes, paymentsRes] = await Promise.all([
            api.get('/student/rooms'),
            api.get('/student/notices'),
            api.get('/student/payments')
          ]);
          setStats({ rooms: roomsRes.data, notices: noticesRes.data, payments: paymentsRes.data });
        }

        // Admin: fetch students and rooms for admin dashboard
        if (role === 'admin') {
          const [studentsRes, roomsRes] = await Promise.all([api.get('/admin/students'), api.get('/admin')]);
          const rooms = roomsRes.data || [];
          const students = (studentsRes.data || []).slice().sort((a, b) => (a.name || '').localeCompare(b.name || ''));

          // build map of roomNumber -> available slots
          const roomMap = {};
          rooms.forEach(r => {
            const occupied = (r.occupants || []).length;
            roomMap[r.roomNumber] = Math.max(r.capacity - occupied, 0);
          });

          setStats(prev => ({ ...prev, adminStudents: students, adminRooms: rooms, roomAvailability: roomMap }));
        }
      } catch (error) {
        toast.error('Failed to load dashboard data.');
        console.error('Dashboard fetch error:', error);
      }
    };

    fetchStats();
  }, [token, role]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  return (
    <>
      {/* Sidebar */}

      {/* Sidebar menu */}
      <div className={`dashboard-sidebar`}>
        <h2>Menu</h2>
        <button onClick={() => navigate('/login')}>Login</button>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* Dashboard content */}
      <div className="dashboard-content">
        <h2 className="wel">WELCOME TO HOSTEL MANAGEMENT SYSTEM</h2>

        {/* Admin-specific components */}
        {role === 'admin' && (
          <>
              <div style={{ padding: 16 }} className="containerdashboard"> 
                <h3>Students and Rooms (sorted by name)</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid #ddd', padding: 8 }}>Name</th>
                      <th style={{ border: '1px solid #ddd', padding: 8 }}>Email</th>
                      <th style={{ border: '1px solid #ddd', padding: 8 }}>Room</th>
                      <th style={{ border: '1px solid #ddd', padding: 8 }}>Room Available</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(stats.adminStudents || []).map(s => (
                      <tr key={s.id}>
                        <td style={{ border: '1px solid #ddd', padding: 8 }}>{s.name}</td>
                        <td style={{ border: '1px solid #ddd', padding: 8 }}>{s.email}</td>
                        <td style={{ border: '1px solid #ddd', padding: 8 }}>{s.room || '-'}</td>
                        <td style={{ border: '1px solid #ddd', padding: 8 }}>{s.room ? (stats.roomAvailability?.[s.room] ?? '-') : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
          </>
        )}

        {/* Common component for both roles */}
        {/* <Notices /> */}

        {/* Student-specific dashboard cards */}
        {role === 'student' && (
          <div className="cards">
            <div className="card">Rooms: {stats.rooms.length}</div>
            <div className="card">Notices: {stats.notices.length}</div>
            <div className="card">Payments: {stats.payments.length}</div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
