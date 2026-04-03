// src/components/StudentComplaints.js
import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/compliants.css'; // Ensure correct path


const Complaints = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [complaints, setComplaints] = useState([]);
  const token = localStorage.getItem('token');

  // Fetch student's own complaints
  const fetchComplaints = async () => {
    try {
      const res = await api.get('/complaints/student', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(res.data);
    } catch (err) {
      toast.error('Failed to load complaints.');
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, );//[]);

  // Submit complaint
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      return toast.warn('Please fill all fields');
    }

    try {
      await api.post(
        '/complaints',
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Complaint submitted successfully');
      setTitle('');
      setDescription('');
      fetchComplaints();
    } catch (err) {
      toast.error('Error submitting complaint');
    }
  };

  return (
    <div className="complaints-container">
      <ToastContainer />
      <h2>📝 Submit a Complaint</h2>
      <form className="complaint-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Complaint Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Describe your issue"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
        />
        <button type="submit">Submit Complaint</button>
      </form>

      <h3>📋 Your Complaints</h3>
      {complaints.length === 0 ? (
        <p>No complaints submitted yet.</p>
      ) : (
        complaints.map((c) => (
          <div className="complaint-item" key={c._id}>
            <strong>{c.title}</strong>
            <p>{c.description}</p>
            <p className={`complaint-status ${c.status.toLowerCase()}`}>
              Status: {c.status}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default Complaints;