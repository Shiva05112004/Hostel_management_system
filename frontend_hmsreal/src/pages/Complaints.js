// src/components/StudentComplaints.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
      const res = await axios.get('http://localhost:5000/api/complaints/student', {
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
      await axios.post(
        'http://localhost:5000/api/complaints',
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
// // src/components/StudentComplaints.js
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import '../styles/compliants.css';

// const Complaints = () => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [complaints, setComplaints] = useState([]);
//   const token = localStorage.getItem('token');

//   const fetchComplaints = async () => {
//     try {
//       const res = await axios.get('http://localhost:5000/api/complaints/student', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setComplaints(res.data);
//     } catch (err) {
//       toast.error('Failed to load complaints.');
//     }
//   };

//   useEffect(() => {
//     fetchComplaints();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!title || !description) return toast.warn('Fill all fields');

//     try {
//       await axios.post(
//         'http://localhost:5000/api/complaints',
//         { title, description },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       toast.success('Complaint submitted');
//       setTitle('');
//       setDescription('');
//       fetchComplaints();
//     } catch (err) {
//       toast.error('Error submitting complaint');
//     }
//   };

//   return (
//     <div className="complaints-container">
//       <h2>Submit Complaint</h2>
//       <form className="complaint-form" onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Complaint Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />
//         <textarea
//           placeholder="Complaint Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           rows="4"
//         />
//         <button type="submit">Submit</button>
//       </form>

//       <h3>Your Complaints</h3>
//       {complaints.map((c) => (
//         <div className="complaint-item" key={c._id}>
//           <strong>{c.title}</strong>
//           <p>{c.description}</p>
//           <p className="complaint-status">Status: {c.status}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Complaints;