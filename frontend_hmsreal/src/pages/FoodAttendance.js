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
    <div className="food-attendance-container1">
      <ToastContainer />
      <h2>🍽️ Student Meal Attendance</h2>

      {/* Mark Attendance Section */}
      <form onSubmit={handleSubmit} className="food-form1">
        <label>Select Meal Type:</label>
        <select value={selectedMealType} onChange={(e) => setSelectedMealType(e.target.value)}>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snacks">Snacks</option>
        </select>

        <div className="date-container" style={{ marginTop: '10px', textAlign: 'center' }}><strong>Date:</strong> {date}</div>

        <div className="meal-box1" style={{ marginTop: '10px', textAlign: 'center' }}>
          <p style={{textAlign:'center',alignContent:'center',margin:'auto',borderRadius:'2rem'}}><strong>Today's Special:</strong> {mealDescription}</p> 
        </div>

        <button type="submit" disabled={attendanceStatus[selectedMealType]} style={{ margin:'auto' ,display:'flex'}}>
          {attendanceStatus[selectedMealType] ? 'Already Marked' : 'Mark Attendance'}
        </button>

        {message && <p className="message">{message}</p>}
      </form>

      {/* Admin Meals List */}
      <div className="student-attendance1">
        <h2>🍛 Meals Added by Admin</h2>
        {meals.length === 0 ? (
          <p>No meals added by admin yet.</p>
        ) : (
          meals.map((meal, index) => (
            <div key={index} className="meal-item1">
              <h3>{meal.mealType}</h3>
              <p style={{textAlign:'center',alignContent:'center',margin:'auto'}}>Date: {new Date(meal.date).toLocaleDateString()}</p>
              <p style={{textAlign:'center',alignContent:'center',margin:'auto',marginTop:'5px',marginInline:'auto'}}>Added by: {meal.addedBy}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FoodAttendance;























