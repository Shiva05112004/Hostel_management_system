import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/login.css'; // Should match with CSS given below

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registered, setRegistered] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const regStatus = localStorage.getItem('registered');
    if (!regStatus || regStatus === 'false') {
      setRegistered(false);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.warn('Please fill in both fields.');
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      toast.success('Login successful');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  if (!registered) {
    return (
      <div className="login-container">
        <div className="glass-box">
          <h3>You are not registered yet.</h3>
          <button onClick={() => navigate('/register')}>Go to Register</button>
        </div>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>
    );
  }

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="glass-box"   autoComplete='on'>
        <h2>Login</h2>

        <div className="input-container">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder=" "
            required
          />
          <label>Email</label>
        </div>

        <div className="input-container">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder=" "
            required
          />
          <label>Password</label>
        </div>

        <button type="submit">Login</button>

        <p>
          Not registered yet?{' '}
          <span onClick={() => navigate('/register')} className="link">Register here</span>
        </p>
      </form>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}

export default Login;
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import '../styles/login.css'; // Make sure this file exists

// function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [registered, setRegistered] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const regStatus = localStorage.getItem('registered');
//     if (!regStatus || regStatus === 'false') {
//       setRegistered(false);
//     }
//   }, []);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (!email || !password) {
//       return toast.warn('Please fill in both fields.');
//     }
//     try {
//       const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
//       localStorage.setItem('token', res.data.token);
//       localStorage.setItem('role', res.data.user.role);
//       toast.success('Login successful');
//       setTimeout(() => {
//         navigate('/');
//       }, 1000);
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Login failed');
//     }
//   };

//   if (!registered) {
//     return (
//       <div className="login-container">
//         <h3>You are not registered yet.</h3>
//         <button onClick={() => navigate('/register')}>Go to Register</button>
//         <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
//       </div>
//     );
//   }

//   return (
//     <div className="login-container">
//       <form onSubmit={handleLogin} className="login-form">
//         <h2>Login</h2>
//         <input
//           type="email"
//           value={email}
//           onChange={e => setEmail(e.target.value)}
//           placeholder="Email"
//           required
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={e => setPassword(e.target.value)}
//           placeholder="Password"
//           required
//         />
//         <button type="submit">Login</button>
//         <p>
//           Not registered yet?{' '}
//           <span onClick={() => navigate('/register')} className="link">Register here</span>
//         </p>
//       </form>
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
//     </div>
//   );
// }

// export default Login;