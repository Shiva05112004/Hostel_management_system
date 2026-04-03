
import React, { useState, useEffect, useCallback, useRef ,useMemo} from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { CSVLink } from 'react-csv';
import { io } from 'socket.io-client';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/AdminPanel.css';
const API = process.env.REACT_APP_API_URL;

const AdminPanel = () => {
  const [mealType, setMealType] = useState('breakfast');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [fetchedDescription, setFetchedDescription] = useState('');
  const [fetchedDate, setFetchedDate] = useState('');
  const [attending, setAttending] = useState([]);
  const [meals, setMeals] = useState([]);

  const token = localStorage.getItem('token');
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);
  const socketRef = useRef(null);
  const currentRoomRef = useRef(null);

  const getAttendance = useCallback(async () => {
    if (!date || !mealType) {
      return toast.error('Please select both meal type and date');
    }

    try {
      const res = await axios.get(
        `${API}/api/food/attending/${mealType}/${date}`,
        { headers }
      );
      console.log("Attendance API response:", res.data);

        if (Array.isArray(res.data.attending)) {
          setAttending(res.data.attending);
          setFetchedDescription(res.data.description || '');
          setFetchedDate(res.data.date || '');
          toast.success('Attendance fetched');

          // join socket room for realtime updates
          try {
            const room = `attendance:${mealType}:${res.data.date || date}`;
            if (socketRef.current) {
              if (currentRoomRef.current && currentRoomRef.current !== room) {
                socketRef.current.emit('leaveRoom', currentRoomRef.current);
              }
              socketRef.current.emit('joinRoom', room);
              currentRoomRef.current = room;
            }
          } catch (e) {
            // ignore
          }
      } else {
        setAttending([]);
          setFetchedDescription('');
          setFetchedDate('');
        toast.info('No students have marked attendance yet.');
      }
    } catch (err) {
      console.error('Error fetching attendance:', err);
      toast.error(err.response?.data?.message || 'Error fetching attendance');
    }
  }, [mealType, date, headers]);

  useEffect(() => {
    // initialize socket connection once on mount
    const tokenLocal = localStorage.getItem('token');
    socketRef.current = io(`${API}`, { auth: { token: tokenLocal } });

    socketRef.current.on('connect', () => {
      console.log('Socket connected', socketRef.current.id);
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('Socket connection error:', err && err.message ? err.message : err);
    });

    socketRef.current.on('attendanceUpdated', (data) => {
      // auto refresh when any attendance update occurs for current selection
      // only refresh if same mealType and date
      const selectedDate = fetchedDate || date;
      if (data && data.mealType === mealType && data.date === selectedDate) {
        getAttendance();
      }
    });

    return () => {
      try {
        if (currentRoomRef.current) socketRef.current.emit('leaveRoom', currentRoomRef.current);
        socketRef.current.disconnect();
      } catch (e) {}
    };
    // intentionally empty deps: create socket once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addMeal = async () => {
    if (!mealType || !date || !description) {
      toast.error('All fields (meal type, date, description) are required');
      return;
    }

    try {
      await axios.post(
        `${API}/api/food/add`,
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
        `${API}/api/food/admin/delete-meal/${mealType}/${date}`,
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
      const res = await axios.get(`${API}/api/food/admin/all-meals`, { headers });
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
    Name: entry.studentId?.name || entry.studentId?._id || 'Unknown',
    Email: entry.studentId?.email || 'N/A',
    MealType: mealType,
    Date: fetchedDate || date || 'N/A',
    FoodItem: fetchedDescription || description || 'N/A'
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
            <button
              onClick={() => {
                if (!csvData.length) return;
                const newWin = window.open('', '_blank');
                const headers = Object.keys(csvData[0]);
                const rows = csvData.map(r => Object.values(r));
                const table = `
                  <table border="1" cellpadding="6" style="border-collapse:collapse;">
                    <thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead>
                    <tbody>
                      ${rows.map(row=>`<tr>${row.map(cell=>`<td>${String(cell)}</td>`).join('')}</tr>`).join('')}
                    </tbody>
                  </table>`;
                const title = `Attendance: ${mealType.toUpperCase()} ${fetchedDate || date || ''}`;
                newWin.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${title}</title></head><body><h3>${title}</h3>${table}</body></html>`);
                newWin.document.close();
              }}
              style={{ marginLeft: 8 }}
            >
              View CSV
            </button>
            {/* Server-side CSV */}
            <a
              href={`${API}/api/food/attending/${mealType}/${date}/csv`}
              className="btn btn-secondary"
              style={{ marginLeft: 8 }}
            >
              Download Server CSV
            </a>
            <button
              onClick={() => {
                const url = `${API}/api/food/attending/${mealType}/${date}/csv?view=1`;
                window.open(url, '_blank');
              }}
              style={{ marginLeft: 8 }}
            >
              View Server CSV
            </button>
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

