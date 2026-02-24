import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/AdminPanel.css';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [pending, setPending] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [selectedRoomForEdit, setSelectedRoomForEdit] = useState('');
  const [roommatesMap, setRoommatesMap] = useState({});

  const fetchStudents = async () => {
    try {
      const res = await api.get('/admin/students');
      setStudents(res.data);
    } catch (err) {
      toast.error('Failed to load students');
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await api.get('/admin');
      setRooms(res.data || []);
    } catch (err) {
      toast.error('Failed to load rooms');
    }
  };

  const fetchPending = async () => {
    try {
      const res = await api.get('/admin/students/pending');
      setPending(res.data);
    } catch (err) {
      toast.error('Failed to load pending students');
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchPending();
    fetchRooms();
  }, []);

  const approve = async (id) => {
    try {
      await api.post(`/admin/students/approve/${id}`);
      toast.success('Student approved');
      fetchStudents();
      fetchPending();
    } catch (err) {
      toast.error('Approve failed');
    }
  };

  const reject = async (id) => {
    try {
      await api.post(`/admin/students/reject/${id}`);
      toast.success('Student rejected');
      fetchPending();
      fetchStudents();
    } catch (err) {
      toast.error('Reject failed');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      // include optional roomId
      await api.post('/admin/students', form);
      toast.success('Student created');
      setForm({ name: '', email: '', password: '' });
      fetchStudents();
      fetchRooms();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Create failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try {
      await api.delete(`/admin/students/${id}`);
      toast.success('Student deleted');
      fetchStudents();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleChangeRoom = async (id) => {
    setEditingStudentId(id);
    setSelectedRoomForEdit('');
  };

  const cancelEditRoom = () => {
    setEditingStudentId(null);
    setSelectedRoomForEdit('');
  };

  const saveChangeRoom = async (id) => {
    if (!selectedRoomForEdit) return toast.warn('Select a room');
    try {
      await api.post('/admin/assign-by-number', { studentId: id, roomNumber: selectedRoomForEdit });
      toast.success('Room reassigned');
      setEditingStudentId(null);
      setSelectedRoomForEdit('');
      fetchStudents();
      fetchRooms();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Change room failed');
    }
  };

  const toggleRoommates = async (student) => {
    const roomNumber = student.room;
    if (!roomNumber) return;
    // if already loaded, toggle off
    if (roommatesMap[student.id]) {
      setRoommatesMap(prev => { const copy = { ...prev }; delete copy[student.id]; return copy; });
      return;
    }
    try {
      const res = await api.get(`/room/number/${encodeURIComponent(roomNumber)}`);
      setRoommatesMap(prev => ({ ...prev, [student.id]: res.data.roommates || [] }));
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to fetch roommates');
    }
  };

  return (
    <div className="admin-panel">
      <ToastContainer />
      <h2 style={{color:'rgba(0,0,0)',backgroundColor:'aqua'}}>Admin — Students</h2>

      <section style={{ marginBottom: '20px' }}><div style={{backgroundColor:'rgba(255, 255, 255, 0.15)',backdropFilter:' blur(15px)',padding:'10px',borderRadius:'8px',borderRadius:'8px',boxShadow:'0 4px 12px rgba(0, 0, 0, 0.3)'}}>
        <h3>Pending Registrations</h3>
        {pending.length === 0 ? (
          <p style={{marginLeft:'200px'}}>No pending students.</p>
        ) : (
          <ul>
            {pending.map(p => (
              <li key={p._id} style={{ marginBottom: '8px' }}>
                {p.name || p.user?.name} — {p.email || p.user?.email}
                <button style={{ marginLeft: 8 }} onClick={() => approve(p._id)}>Approve</button>
                <button style={{ marginLeft: 8 }} onClick={() => reject(p._id)}>Reject</button>
              </li>
            ))}
          </ul>
        )}</div>
      </section>

      <section style={{ marginBottom: '20px' }}>
         <div className='form_submit'>
        <h3>Create Student (Admin)</h3>
       
        <form onSubmit={handleAdd} style={{ display: 'grid', gap: 8 }}>
          <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <select value={form.roomId || ''} onChange={e => setForm({ ...form, roomId: e.target.value })}>
            <option value="">-- No Room --</option>
            {rooms.map(r => (
              <option key={r._id} value={r._id}>
                {`Room ${r.roomNumber} (available: ${Math.max(r.capacity - (r.occupants?.length||0), 0)})`}
              </option>
            ))}
          </select>
          <button type="submit">Create</button>
        </form>
        </div>
      </section>

      <section>
        <div className='section'>
        <h3 style={{alignContent:'center'}}>All Students</h3>
        {students.length === 0 ? (
          <p>No students.</p>
        ) : (
          <table className="meal-list" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Room</th>
                <th>Approved</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.room || '-'}</td>
                  <td>
                    {s.room ? (
                      <div>
                        <button onClick={() => toggleRoommates(s)}>{roommatesMap[s.id] ? 'Hide' : 'Show'} roommates</button>
                        {roommatesMap[s.id] && (
                          <ul style={{ marginTop: 8 }}>
                            {roommatesMap[s.id].length === 0 ? <li>No roommates</li> : roommatesMap[s.id].map(r => <li key={r.id}>{r.name}</li>)}
                          </ul>
                        )}
                      </div>
                    ) : '-'}
                  </td>
                  <td>{s.approved ? 'Yes' : 'No'}</td>
                  <td className='delete_btn'>
                    <button onClick={() => handleDelete(s.id)}>Delete</button><br></br>
                    {editingStudentId === s.id ? (
                      <span style={{ marginLeft: 8 }}>
                        <select value={selectedRoomForEdit} onChange={e => setSelectedRoomForEdit(e.target.value)}>
                          <option value="">Select room</option>
                          {rooms.map(r => (
                            <option key={r._id} value={r.roomNumber}>{`Room ${r.roomNumber} (avail: ${Math.max(r.capacity - (r.occupants?.length||0),0)})`}</option>
                          ))}
                        </select>
                        <button onClick={() => saveChangeRoom(s.id)} style={{ marginLeft: 8 }}>Save</button><br></br>
                        <button onClick={cancelEditRoom} style={{ marginLeft: 8 }}>Cancel</button>
                      </span>
                    ) : (
                  <button style={{ marginLeft: 8 }} onClick={() => handleChangeRoom(s.id)}>Change room</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        </div>
      </section>
    </div>
  );
};

export default AdminStudents;
