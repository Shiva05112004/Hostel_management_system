import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/addNotices.css';
const API = process.env.REACT_APP_API_URL;

const AddNotice = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !message) {
      return toast.warn('Please fill all fields.');
    }

    try {
      const res = await axios.post(
        `${API}/api/notices/add`,
        { title, message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success(res.data.message);
      setTitle('');
      setMessage('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add notice.');
    }
  };

  return (
    <div className="add-notice-container">
      <form onSubmit={handleSubmit} className="add-notice-form">
        <h2>Add Notice</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Notice Title"
          required
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Notice Message"
          rows="5"
          required
        />
        <button type="submit">Add Notice</button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddNotice;