// App.js - React frontend entry point with full routing and backend connection

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Notices from './pages/Notices';
import Payments from './pages/Payments';
import Complaints from './pages/Complaints';
import FoodAttendance from './pages/FoodAttendance';
import AdminPanel from './pages/AdminPanel';
import AdminStudents from './pages/AdminStudents';
import MyRoom from './pages/myroom';
import AssignRoom from './pages/AssignRoom';
import ProtectedRoute from './components/ProtectedRoute';

import AdminComplaints from './pages/AdminComplaints'; 
import AddNotices from './pages/AddNotices';
import AdminRoomManager from './pages/AdminRoomManager';








function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/student/complaints" element={<Complaints />} />
        <Route path="/food-attendance" element={<FoodAttendance />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/complaints" element={<AdminComplaints />} />
        <Route path="/admin/add-notice" element={<AddNotices />} />
        <Route path="/admin/rooms" element={<AdminRoomManager />} />

                

        {/* <Route path="/assign-room" element={<AssignRoom />} /> */}
          <Route
          path="/assign-room"
          element={
            <ProtectedRoute role="admin">
              <AssignRoom />
            </ProtectedRoute>
          }
        /><Route path="/my-room" element={<MyRoom />} />

      </Routes>
    </Router>
  );

}

export default App;

