import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">🏨      HOSTEL MANAGEMENT </div>

      <div className="navbar-links">
        {token && <Link to="/">Dashboard</Link>}
        {/* {token && <Link to="/rooms">Rooms</Link>} */}
        {/* {token && <Link to="/notices">Notices</Link>} */}


        {role === 'student' && (
          <>
            {/* <Link to="/my-room">My Room</Link> */}
            <Link to="/payments">Payments</Link>
            {/* <Link to="/complaints">Complaints</Link> */}
            <Link to="/food-attendance">Food Attendance</Link>
            <Link to="/student/complaints">My Complaints</Link>
             {token && <Link to="/rooms">Rooms</Link>}
               {token && <Link to="/notices">Notices</Link>}
            {/* <link to="/AddNotices">Add Notices</link>
            <link to="/AdminRoomManagement">Admin Room Management</link> */}
            


          </>
        )}

        {/* {role === 'admin' &&  <Link to="/admin">Admin Panel</Link>} */}
{role === 'admin' && (
  <>
    <Link to="/admin">Admin Panel</Link>
    
    <Link to="/admin/complaints">All Complaints</Link>
     
       <Link to="/admin/add-notice">Add Notice</Link>
    <Link to="/admin/rooms">Room Manager</Link>
    <Link to="/admin/students">Students</Link>
  </>
)}

        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

