// src/components/AdminComplaints.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CSVLink } from 'react-csv';
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

  const csvData = complaints.map(c => ({
    Title: c.title,
    Description: c.description,
    StudentName: c.student?.name || 'N/A',
    StudentEmail: c.student?.email || 'N/A',
    RoomNumber: c.roomNumber || 'N/A',
    Status: c.status,
    CreatedAt: c.createdAt
  }));

  const viewCSV = () => {
    if (!csvData.length) return toast.info('No complaints to export');
    const headers = Object.keys(csvData[0]);
    const rows = csvData.map(r => Object.values(r));
    const table = `
      <table border="1" cellpadding="6" style="border-collapse:collapse;">
        <thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead>
        <tbody>
          ${rows.map(row=>`<tr>${row.map(cell=>`<td>${String(cell)}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>`;
    const newWin = window.open('', '_blank');
    newWin.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Complaints CSV Preview</title></head><body><h3>Complaints</h3>${table}</body></html>`);
    newWin.document.close();
  };

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

  const deleteComplaint = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/complaints/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Complaint deleted');
      fetchComplaints();
    } catch (err) {
      toast.error('Failed to delete complaint');
    }
  };

  return (
    <div>
      <h2>All Student Complaints</h2>
      <div style={{ marginBottom: 12 }} className='container'>
        <CSVLink data={csvData} filename={`complaints_export.csv`} className="container">
          Download CSV
        </CSVLink>
        <br></br>
        <button onClick={viewCSV} style={{ marginLeft: 8 }} className=''>
          View CSV
        </button>
      </div>
       
      {complaints.map((c) => (
        <div className="complaint-item" key={c._id}>
          <strong style={{alignContent:'center',justifyContent:'center'}}>{c.title}</strong>
          <p>{c.description}</p>
          <p>
            Student: {c.student?.name} ({c.student?.email})
          </p>
          <p>
            Room: {c.roomNumber || 'N/A'}
          </p>
          <p className="complaint-status">Status: {c.status}</p>
          {c.status !== 'Resolved' ? (
            <button className="mark-resolved-btn" onClick={() => markResolved(c._id)}>
              Mark as Resolved
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="mark-resolved-btn" disabled>
                Resolved
              </button>
              <button className="delete-btn" onClick={() => deleteComplaint(c._id)}>
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminComplaints;
