
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { CSVLink } from 'react-csv';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const [mealType, setMealType] = useState('breakfast');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [attending, setAttending] = useState([]);
  const [meals, setMeals] = useState([]);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const getAttendance = useCallback(async () => {
    if (!date || !mealType) {
      return toast.error('Please select both meal type and date');
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/food/attending/${mealType}/${date}`,
        { headers }
      );
      console.log("Attendance API response:", res.data);

      if (Array.isArray(res.data.attending)) {
        setAttending(res.data.attending);
        toast.success('Attendance fetched');
      } else {
        setAttending([]);
        toast.info('No students have marked attendance yet.');
      }
    } catch (err) {
      console.error('Error fetching attendance:', err);
      toast.error(err.response?.data?.message || 'Error fetching attendance');
    }
  }, [mealType, date, headers]);

  const addMeal = async () => {
    if (!mealType || !date || !description) {
      toast.error('All fields (meal type, date, description) are required');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/food/add',
        { mealType, date, description },
        { headers }
      );
      toast.success('Meal added!');
      setDescription('');
      fetchMeals();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add meal');
    }
  };

  const deleteMeal = async (mealType, date) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/food/admin/delete-meal/${mealType}/${date}`,
        { headers }
      );
      toast.success('Meal deleted!');
      fetchMeals();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete meal');
    }
  };

  const fetchMeals = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/food/admin/all-meals', { headers });
      setMeals(res.data || []);
    } catch (err) {
      toast.error('Could not fetch meals');
    }
  }, [headers]);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  const csvData = attending.map((entry, index) => ({
    Serial: index + 1,
    Name: entry.studentId?.name || 'Unknown',
    Email: entry.studentId?.email || 'N/A',
    MealType: mealType,
    Date: date
  }));

  return (
    <div className="admin-panel">
      <ToastContainer />
      <h2>Admin Panel – Meal Attendance</h2>

      <div className="admin-actions">
        <div className="form-group">
          <label>Meal:</label>
          <select value={mealType} onChange={(e) => setMealType(e.target.value)}>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snacks">Snacks</option>
          </select>
        </div>

        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <input
            type="text"
            placeholder="e.g., Idli, Sambar, Chutney"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="action-buttons">
          <button onClick={getAttendance}>View Attendance</button>
          <button onClick={addMeal}>Add Meal</button>
        </div>
      </div>

      <div className="attendance-section">
        <h3>
          Attendance for <u>{mealType.toUpperCase()}</u> on <u>{date || '...'}</u>
        </h3>

        <div style={{ marginBottom: '10px', fontSize: '16px' }}>
          <strong>Meal:</strong> {mealType.toUpperCase()}<br />
          <strong>Date:</strong> {date || 'Not Selected'}<br />
          <strong>Total Students Attending:</strong>{' '}
          <span style={{ color: 'green', fontSize: '18px' }}>{attending.length}</span>
        </div>

        {attending.length > 0 ? (
          <>
            <ul className="attendance-list">
              {attending.map((entry, i) => (
                // <li key={i}>{entry.studentId?.name || entry.studentId}</li>
                <li key={i}>{entry.studentId?.name}</li>

              ))}
            </ul>

            <CSVLink
              data={csvData}
              filename={`Attendance_${mealType}_${date}.csv`}
              className="btn btn-primary"
            >
              Download Attendance CSV
            </CSVLink>
          </>
        ) : (
          <p className="no-records">No attendance records found.</p>
        )}
      </div>

      <div className="meal-list-section">
        <h3>All Meals</h3>
        {meals.length > 0 ? (
          <ul className="meal-list">
            {meals.map((meal, index) => (
              <li key={index} className="meal-item">
                <strong>{meal.mealType.toUpperCase()}</strong> on <em>{meal.date}</em><br />
                <span><strong>Description:</strong> {meal.description}</span><br />
                <span><strong>Added by:</strong> {meal.addedBy || 'Unknown'}</span><br />
                <button
                  className="delete-btn"
                  onClick={() => deleteMeal(meal.mealType, meal.date)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-records">No meals added yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;


// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import { CSVLink } from 'react-csv';
// import 'react-toastify/dist/ReactToastify.css';
// import '../styles/AdminPanel.css';

// const AdminPanel = () => {
//   const [mealType, setMealType] = useState('breakfast');
//   const [date, setDate] = useState('');
//   const [description, setDescription] = useState('');
//   const [attending, setAttending] = useState([]);
//   const [meals, setMeals] = useState([]);

//   const token = localStorage.getItem('token');
//   const headers = { Authorization: `Bearer ${token}` };

//   const getAttendance = useCallback(async () => {
//     if (!date || !mealType) {
//       return toast.error('Please select both meal type and date');
//     }

//     try {
//       const res = await axios.get(
//         `http://localhost:5000/api/food/attending/${mealType}/${date}`,
//         { headers }
//       );
//       console.log("Attendance API response:", res.data);

//       if (Array.isArray(res.data.attending)) {
//         setAttending(res.data.attending);
//         toast.success('Attendance fetched');
//       } else {
//         setAttending([]);
//         toast.info('No students have marked attendance yet.');
//       }
//     } catch (err) {
//       console.error('Error fetching attendance:', err);
//       toast.error(err.response?.data?.message || 'Error fetching attendance');
//     }
//   }, [mealType, date, headers]);

//   const addMeal = async () => {
//     if (!mealType || !date || !description) {
//       toast.error('All fields (meal type, date, description) are required');
//       return;
//     }

//     try {
//       await axios.post(
//         'http://localhost:5000/api/food/add',
//         { mealType, date, description },
//         { headers }
//       );
//       toast.success('Meal added!');
//       setDescription('');
//       fetchMeals();
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to add meal');
//     }
//   };

//   const deleteMeal = async (mealType, date) => {
//     try {
//       await axios.delete(
//         `http://localhost:5000/api/food/admin/delete-meal/${mealType}/${date}`,
//         { headers }
//       );
//       toast.success('Meal deleted!');
//       fetchMeals();
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to delete meal');
//     }
//   };

//   const fetchMeals = useCallback(async () => {
//     try {
//       const res = await axios.get('http://localhost:5000/api/food/admin/all-meals', { headers });
//       setMeals(res.data || []);
//     } catch (err) {
//       toast.error('Could not fetch meals');
//     }
//   }, [headers]);

//   useEffect(() => {
//     fetchMeals();
//   }, [fetchMeals]);

//   const csvData = attending.map((entry, index) => ({
//     Serial: index + 1,
//     Name: entry.studentId?.name || 'Unknown',
//     Email: entry.studentId?.email || 'N/A',
//     MealType: mealType,
//     Date: date
//   }));

//   return (
//     <div className="admin-panel">
//       <ToastContainer />
//       <h2>Admin Panel – Meal Attendance</h2>

//       <div className="admin-actions">
//         <div className="form-group">
//           <label>Meal:</label>
//           <select value={mealType} onChange={(e) => setMealType(e.target.value)}>
//             <option value="breakfast">Breakfast</option>
//             <option value="lunch">Lunch</option>
//             <option value="dinner">Dinner</option>
//             <option value="snacks">Snacks</option>
//           </select>
//         </div>

//         <div className="form-group">
//           <label>Date:</label>
//           <input
//             type="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//           />
//         </div>

//         <div className="form-group">
//           <label>Description:</label>
//           <input
//             type="text"
//             placeholder="e.g., Idli, Sambar, Chutney"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//           />
//         </div>

//         <div className="action-buttons">
//           <button onClick={getAttendance}>View Attendance</button>
//           <button onClick={addMeal}>Add Meal</button>
//         </div>
//       </div>

//       <div className="attendance-section">
//         <h3>
//           Attendance for <u>{mealType.toUpperCase()}</u> on <u>{date || '...'}</u>
//         </h3>

//         <div style={{ marginBottom: '10px', fontSize: '16px' }}>
//           <strong>Meal:</strong> {mealType.toUpperCase()}<br />
//           <strong>Date:</strong> {date || 'Not Selected'}<br />
//           <strong>Total Students Attending:</strong>{' '}
//           <span style={{ color: 'green', fontSize: '18px' }}>{attending.length}</span>
//         </div>

//         {attending.length > 0 ? (
//           <>
//             <ul className="attendance-list">
//               {attending.map((entry, i) => (
//                 // <li key={i}>{entry.studentId?.name || entry.studentId}</li>
//                 <li key={i}>{entry.studentId?.name}</li>

//               ))}
//             </ul>

//             <CSVLink
//               data={csvData}
//               filename={`Attendance_${mealType}_${date}.csv`}
//               className="btn btn-primary"
//             >
//               Download Attendance CSV
//             </CSVLink>
//           </>
//         ) : (
//           <p className="no-records">No attendance records found.</p>
//         )}
//       </div>

//       <div className="meal-list-section">
//         <h3>All Meals</h3>
//         {meals.length > 0 ? (
//           <ul className="meal-list">
//             {meals.map((meal, index) => (
//               <li key={index} className="meal-item">
//                 <strong>{meal.mealType.toUpperCase()}</strong> on <em>{meal.date}</em><br />
//                 <span><strong>Description:</strong> {meal.description}</span><br />
//                 <span><strong>Added by:</strong> {meal.addedBy || 'Unknown'}</span><br />
//                 <button
//                   className="delete-btn"
//                   onClick={() => deleteMeal(meal.mealType, meal.date)}
//                 >
//                   Delete
//                 </button>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="no-records">No meals added yet.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminPanel;


