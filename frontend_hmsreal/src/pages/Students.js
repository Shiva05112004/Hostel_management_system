// import { useEffect, useState } from "react";
// import axios from "../api/axios";
// import { motion } from "framer-motion";

// export default function Students() {
//   const [students, setStudents] = useState([]);

//   useEffect(() => {
//     axios.get("/students").then(res => setStudents(res.data));
//   }, []);

//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
//       <h2 className="text-xl font-bold mb-2">Students</h2>
//       <ul className="space-y-2">
//         {students.map(student => (
//           <li key={student._id} className="border p-2 rounded">{student.name} - {student.email}</li>
//         ))}
//       </ul>
//     </motion.div>
//   );
// }