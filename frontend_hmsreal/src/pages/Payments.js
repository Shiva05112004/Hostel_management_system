import axios from "axios";
import { useEffect, useState } from "react";

const Payments = () => {
  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/student/payments", {
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

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const Payments = () => {
//   const [payments, setPayments] = useState([]);

//   useEffect(() => {
//     const fetch = async () => {
//       const token = localStorage.getItem('token');
//       const res = await axios.get('http://localhost:5000/api/student/payments', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setPayments(res.data);
//     };
//     fetch();
//   }, []);

//   return (
//     <div className="page">
//       <h2>Payment History</h2>
//       <ul>
//         {payments.map(p => (
//           <li key={p._id}>
//             ₹{p.amount} – {p.status} – {new Date(p.date).toLocaleDateString()}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Payments;
