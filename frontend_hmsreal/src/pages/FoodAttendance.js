import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/FoodAttendance.css'; // Reuse the same styling

const FoodAttendance = () => {
  const [meals, setMeals] = useState([]);
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  const [mealDescription, setMealDescription] = useState('');
  const [date] = useState(() => new Date().toISOString().split('T')[0]);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  // Fetch all meals
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/food/meals', { headers });
        setMeals(res.data);
      } catch (error) {
        console.error('Error fetching meals:', error);
        toast.error('Failed to load meals.');
      }
    };

    fetchMeals();
  }, [token]);

  // Fetch selected meal's description
  useEffect(() => {
    const fetchMealDescription = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/food/today-meal/${selectedMealType}/${date}`,
          { headers }
        );
        setMealDescription(res.data?.description || 'No description available.');
      } catch (err) {
        setMealDescription('No description found.');
      }
    };

    fetchMealDescription();
  }, [selectedMealType, date]);

  // Check if attendance is already marked for selected meal type
  useEffect(() => {
    const checkAttendance = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/food/attendance-status/${selectedMealType}/${date}`,
          { headers }
        );
        setAttendanceStatus((prev) => ({
          ...prev,
          [selectedMealType]: res.data.attended
        }));
      } catch (err) {
        setAttendanceStatus((prev) => ({
          ...prev,
          [selectedMealType]: false
        }));
      }
    };

    checkAttendance();
  }, [selectedMealType, date]);

  // Handle attendance submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/food/attendance',
        { mealType: selectedMealType, date },
        { headers }
      );

      setAttendanceStatus((prev) => ({
        ...prev,
        [selectedMealType]: true
      }));

      setMessage(res.data.message || 'Attendance marked successfully!');
      toast.success(res.data.message || 'Attendance marked!');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error submitting attendance';
      setMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div className="food-attendance-container">
      <ToastContainer />
      <h2>🍽️ Student Meal Attendance</h2>

      {/* Mark Attendance Section */}
      <form onSubmit={handleSubmit} className="food-form">
        <label>Select Meal Type:</label>
        <select value={selectedMealType} onChange={(e) => setSelectedMealType(e.target.value)}>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snacks">Snacks</option>
        </select>

        <p><strong>Date:</strong> {date}</p>

        <div className="meal-box">
          <p><strong>Today's Special:</strong> {mealDescription}</p>
        </div>

        <button type="submit" disabled={attendanceStatus[selectedMealType]}>
          {attendanceStatus[selectedMealType] ? 'Already Marked' : 'Mark Attendance'}
        </button>

        {message && <p className="message">{message}</p>}
      </form>

      {/* Admin Meals List */}
      <div className="student-attendance">
        <h2>🍛 Meals Added by Admin</h2>
        {meals.length === 0 ? (
          <p>No meals added by admin yet.</p>
        ) : (
          meals.map((meal, index) => (
            <div key={index} className="meal-item">
              <h3>{meal.mealType}</h3>
              <p>Date: {new Date(meal.date).toLocaleDateString()}</p>
              <p>Added by: {meal.addedBy}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FoodAttendance;

























 
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import '../styles/FoodAttendance.css';

// const FoodAttendance = () => {
//   const [adminMealsToday, setAdminMealsToday] = useState([]);
//   const [selectedMealType, setSelectedMealType] = useState('');
//   const [mealDescription, setMealDescription] = useState('');
//   const [date] = useState(() => new Date().toISOString().split('T')[0]);
//   const [attending, setAttending] = useState(false);
//   const [message, setMessage] = useState('');

//   const token = localStorage.getItem('token');
//   const headers = { Authorization: `Bearer ${token}` };

//   // Fetch all meals for today added by admin
//   useEffect(() => {
//     const fetchMeals = async () => {
//       try {
//         const res = await axios.get('http://localhost:5000/api/food/meals', { headers });
//         const todayMeals = res.data.filter(meal => {
//           return new Date(meal.date).toISOString().split('T')[0] === date;
//         });
//         setAdminMealsToday(todayMeals);
//         if (todayMeals.length > 0) {
//           setSelectedMealType(todayMeals[0].mealType); // Set default meal
//           setMealDescription(todayMeals[0].description); // Set default description
//         }
//       } catch (error) {
//         console.error('Error fetching meals:', error);
//         toast.error('Failed to load meals.');
//       }
//     };

//     fetchMeals();
//   }, [token, date]);

//   // Update description when meal type changes
//   useEffect(() => {
//     if (!selectedMealType || adminMealsToday.length === 0) return;

//     const selectedMeal = adminMealsToday.find(meal => meal.mealType === selectedMealType);
//     setMealDescription(selectedMeal?.description || 'No description available.');
//   }, [selectedMealType, adminMealsToday]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');

//     try {
//       const res = await axios.post(
//         'http://localhost:5000/api/food/attendance',
//         { mealType: selectedMealType, date },
//         { headers }
//       );
//       setMessage(res.data.message || 'Attendance marked successfully!');
//       setAttending(true);
//       toast.success(res.data.message || 'Attendance marked!');
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || 'Error submitting attendance';
//       setMessage(errorMsg);
//       toast.error(errorMsg);
//     }
//   };

//   return (
//     <div className="food-attendance-container">
//       <ToastContainer />
//       <h2>🍽️ Student Meal Attendance</h2>

//       {adminMealsToday.length === 0 ? (
//         <p>No meals available to mark attendance for today.</p>
//       ) : (
//         <form onSubmit={handleSubmit} className="food-form">
//           <label>Select Meal Type:</label>
//           <select
//             value={selectedMealType}
//             onChange={(e) => {
//               setSelectedMealType(e.target.value);
//               setAttending(false);
//               setMessage('');
//             }}
//           >
//             {adminMealsToday.map((meal, index) => (
//               <option key={index} value={meal.mealType}>
//                 {meal.mealType}
//               </option>
//             ))}
//           </select>

//           <p><strong>Date:</strong> {date}</p>

//           <div className="meal-box">
//             <p><strong>Today's Food Item:</strong> {mealDescription}</p>
//           </div>

//           <button type="submit" disabled={attending}>
//             {attending ? 'Already Marked' : 'Mark Attendance'}
//           </button>

//           {message && <p className="message">{message}</p>}
//         </form>
//       )}

//       {/* Admin Meals List */}
//       <div className="student-attendance">
//         <h2>🍛 Meals Added by Admin</h2>
//         {adminMealsToday.length === 0 ? (
//           <p>No meals added by admin yet.</p>
//         ) : (
//           adminMealsToday.map((meal, index) => (
//             <div key={index} className="meal-item">
//               <h3>{meal.mealType}</h3>
//               <p>Date: {new Date(meal.date).toLocaleDateString()}</p>
//               <p><strong>Food Item:</strong> {meal.description}</p>
//               <p><strong>Added by:</strong> {meal.addedBy}</p>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default FoodAttendance;
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import '../styles/FoodAttendance.css';

// const FoodAttendance = () => {
//   const [adminMealsToday, setAdminMealsToday] = useState([]);
//   const [selectedMealType, setSelectedMealType] = useState('');
//   const [mealDescription, setMealDescription] = useState('');
//   const [date] = useState(() => new Date().toISOString().split('T')[0]);
//   const [attending, setAttending] = useState(false);
//   const [message, setMessage] = useState('');

//   const token = localStorage.getItem('token');
//   const headers = { Authorization: `Bearer ${token}` };

//   // Fetch all meals for today added by admin
//   useEffect(() => {
//     const fetchMeals = async () => {
//       try {
//         const res = await axios.get('http://localhost:5000/api/food/meals', { headers });
//         // Filter meals for today
//         const todayMeals = res.data.filter(meal => {
//           return new Date(meal.date).toISOString().split('T')[0] === date;
//         });
//         setAdminMealsToday(todayMeals);
//         if (todayMeals.length > 0) {
//           setSelectedMealType(todayMeals[0].mealType); // Default to first mealType
//         }
//       } catch (error) {
//         console.error('Error fetching meals:', error);
//         toast.error('Failed to load meals.');
//       }
//     };

//     fetchMeals();
//   }, [token, date]);

//   // Fetch selected meal's description
//   useEffect(() => {
//     if (!selectedMealType) return;
//     const fetchMealDescription = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:5000/api/food/today-meal/${selectedMealType}/${date}`,
//           { headers }
//         );
//         setMealDescription(res.data?.description || 'No description available.');
//       } catch (err) {
//         setMealDescription('No description found.');
//       }
//     };

//     fetchMealDescription();
//   }, [selectedMealType, date]);

//   // Handle attendance submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');

//     try {
//       const res = await axios.post(
//         'http://localhost:5000/api/food/attendance',
//         { mealType: selectedMealType, date },
//         { headers }
//       );
//       setMessage(res.data.message || 'Attendance marked successfully!');
//       setAttending(true);
//       toast.success(res.data.message || 'Attendance marked!');
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || 'Error submitting attendance';
//       setMessage(errorMsg);
//       toast.error(errorMsg);
//     }
//   };

//   return (
//     <div className="food-attendance-container">
//       <ToastContainer />
//       <h2>🍽️ Student Meal Attendance</h2>

//       {/* Mark Attendance Section */}
//       {adminMealsToday.length === 0 ? (
//         <p>No meals available to mark attendance for today.</p>
//       ) : (
//         <form onSubmit={handleSubmit} className="food-form">
//           <label>Select Meal Type:</label>
//           <select
//             value={selectedMealType}
//             onChange={(e) => {
//               setSelectedMealType(e.target.value);
//               setAttending(false); // Reset for new selection
//               setMessage('');
//             }}
//           >
//             {adminMealsToday.map((meal, index) => (
//               <option key={index} value={meal.mealType}>
//                 {meal.mealType}
//               </option>
//             ))}
//           </select>

//           <p><strong>Date:</strong> {date}</p>

//           <div className="meal-box">
//             <p><strong>Today's Special:</strong> {mealDescription}</p>
//           </div>

//           <button type="submit" disabled={attending}>
//             {attending ? 'Already Marked' : 'Mark Attendance'}
//           </button>

//           {message && <p className="message">{message}</p>}
//         </form>
//       )}

//       {/* Admin Meals List */}
//       <div className="student-attendance">
//         <h2>🍛 Meals Added by Admin</h2>
//         {adminMealsToday.length === 0 ? (
//           <p>No meals added by admin yet.</p>
//         ) : (
//           adminMealsToday.map((meal, index) => (
//             <div key={index} className="meal-item">
//               <h3>{meal.mealType}</h3>
//               <p>Date: {new Date(meal.date).toLocaleDateString()}</p>
//               <p>Added by: {meal.addedBy}</p>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default FoodAttendance;