// src/components/AdminComplaints.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/compliants.css';

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const token = localStorage.getItem('token');

  const fetchComplaints = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/complaints', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(res.data);
    } catch (err) {
      toast.error('Failed to load complaints.');
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const markResolved = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/complaints/${id}`,
        { status: 'Resolved' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Marked as resolved');
      fetchComplaints();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="complaints-container">
      <h2>All Student Complaints</h2>
      {complaints.map((c) => (
        <div className="complaint-item" key={c._id}>
          <strong>{c.title}</strong>
          <p>{c.description}</p>
          <p>
            Student: {c.student?.name} ({c.student?.email})
          </p>
          <p className="complaint-status">Status: {c.status}</p>
          {c.status !== 'Resolved' && (
            <button className="mark-resolved-btn" onClick={() => markResolved(c._id)}>
              Mark as Resolved
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminComplaints;
