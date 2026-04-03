import api from '../api/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/reg.css'; 
// Ensure this includes your CSS shared above

function Register() {
  const [data, setData] = useState({ name: '', email: '', password: '', role: 'student' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!data.name || !data.email || !data.password) {
      return toast.warn('Please fill all fields');
    }

    try {
      await api.post('/auth/register', data);
      toast.success('Registration successful');
      localStorage.setItem('registered', true);
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="reg">
      <form id="sh" onSubmit={handleRegister} autoComplete='on'>
        <h2>Register</h2>

        <div className="input-container">
          <input
            type="text"
            value={data.name}
            onChange={e => setData({ ...data, name: e.target.value })}
            placeholder=" "
            required
          />
          <label>Name</label>
        </div>

        <div className="input-container">
          <input
            type="email"
            value={data.email}
            onChange={e => setData({ ...data, email: e.target.value })}
            placeholder=" "
            required
          />
          <label>Email</label>
        </div>

        <div className="input-container">
          <input
            type="password"
            value={data.password}
            onChange={e => setData({ ...data, password: e.target.value })}
            placeholder=" "
            required
          />
          <label>Password</label>
        </div>

        <div className="input-container">
          <select
            value={data.role}
            onChange={e => setData({ ...data, role: e.target.value })}
            required
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
          <label></label>
        </div>


        <button id="shs2" type="submit"  style={{width: '100px',marginLeft: '120px'}}>Register</button>

        <div className='input-container' style={{ marginTop: '10px', textAlign: 'center' }}>
          Already registered?{' '}
          <span onClick={() => navigate('/login')} className="link">Login here</span>
        </div>
      </form>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}

export default Register;