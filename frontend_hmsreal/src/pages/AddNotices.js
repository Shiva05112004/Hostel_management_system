import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/addNotices.css';

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
        'http://localhost:5000/api/notices/add',
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
// import React, { useState } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const AddNotice = () => {
//   const [title, setTitle] = useState('');
//   const [message, setMessage] = useState(''); // changed from description to message
//   const token = localStorage.getItem('token');

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!title || !message) {
//       return toast.warn('Please fill all fields.');
//     }

//     try {
//       console.log("Stored Token:", token);

//       const res = await axios.post(
//         'http://localhost:5000/api/notices/add',
//         { title, message }, // changed from description to message
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//       toast.success(res.data.message);
//       setTitle('');
//       setMessage('');
//     } catch (error) {
//       console.error("Add Notice Error:", error);
//       toast.error(error.response?.data?.message || 'Failed to add notice.');
//     }
//   };

//   return (
//     <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
//       <h2>Add Notice</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="Title"
//           required
//           style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
//         />
//         <textarea
//           value={message} // changed from description
//           onChange={(e) => setMessage(e.target.value)} // changed from description
//           placeholder="Message"
//           rows="4"
//           required
//           style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
//         />
//         <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none' }}>
//           Add Notice
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddNotice;



