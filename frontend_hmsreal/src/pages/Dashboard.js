// components/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import AddNotice from './AddNotices';
import Notices from './Notices';
import AdminRoomManager from './AdminRoomManager';

const Dashboard = () => {
  const [stats, setStats] = useState({ rooms: [], notices: [], payments: [] });
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      if (role !== 'student') return;

      try {
        const [roomsRes, noticesRes, paymentsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/student/rooms', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/student/notices', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/student/payments', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setStats({
          rooms: roomsRes.data,
          notices: noticesRes.data,
          payments: paymentsRes.data
        });
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
      {/* Sidebar toggle */}
      <div className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </div>

      {/* Sidebar menu */}
      <div className={`dashboard-sidebar ${isOpen ? 'open' : ''}`}>
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
            {/* <AddNotice />
            <AdminRoomManager /> */}
          </>
        )}

        {/* Common component for both roles */}
        <Notices />

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
