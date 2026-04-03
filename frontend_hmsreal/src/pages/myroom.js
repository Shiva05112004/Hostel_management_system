import React, { useEffect, useState } from 'react'
import api from '../api/axios'

const MyRoom = () => {
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [inputRoomNumber, setInputRoomNumber] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMyRoom = async () => {
      try {
        const res = await api.get('/room/myroom')
        setRoom(res.data)
        setInputRoomNumber(res.data?.roomNumber || '')
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchMyRoom()
  }, [])

  const fetchByNumber = async (e) => {
    e && e.preventDefault()
    setError(null)
    if (!inputRoomNumber) return
    try {
      const res = await api.get(`/room/number/${encodeURIComponent(inputRoomNumber)}`)
      setRoom(res.data)
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.msg || 'Failed to fetch roommates')
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h2>My Room</h2>
      {room ? (
        <div>
          <p>
            You are assigned to Room {room.roomNumber} (Capacity: {room.capacity})
          </p>

          <form onSubmit={fetchByNumber} style={{ marginBottom: 12 }}>
            <label style={{ marginRight: 8 }}>Room Number:</label>
            <input value={inputRoomNumber} onChange={e => setInputRoomNumber(e.target.value)} />
            <button type='submit' style={{ marginLeft: 8 }}>Get Roommates</button>
          </form>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div>
            <h4>Roommates</h4>
            {room.roommates && room.roommates.length > 0 ? (
              <ul>
                {room.roommates.map(r => (
                  <li key={r.id}>{r.name}</li>
                ))}
              </ul>
            ) : (
              <p>No roommates assigned.</p>
            )}
          </div>
        </div>
      ) : (
        <div>
          <p>No room assigned yet.</p>
          <form onSubmit={fetchByNumber}>
            <label>Room Number:</label>
            <input value={inputRoomNumber} onChange={e => setInputRoomNumber(e.target.value)} />
            <button type='submit'>Get Roommates</button>
          </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}
    </div>
  )
}

export default MyRoom
