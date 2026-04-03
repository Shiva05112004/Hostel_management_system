import api from '../api/axios';
import { useEffect, useState } from "react";


const Payments = () => {
  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get('/api/student/payments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(res.data);
    } catch (err) {
      console.error("Error fetching payments:", err);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div>
      <h2>My Payments</h2>
      <ul>
        {payments.map((pay) => (
          <li key={pay._id}>
            ₹{pay.amount} for {pay.month} - {pay.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Payments;