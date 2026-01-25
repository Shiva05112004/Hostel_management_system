// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";

// export default function Sidebar() {
//   return (
//     <motion.aside
//       initial={{ x: -100, opacity: 0 }}
//       animate={{ x: 0, opacity: 1 }}
//       transition={{ duration: 0.5 }}
//       className="w-64 h-full bg-gray-200 p-4"
//     >
//       <nav>
//         <ul className="space-y-2">
//           <li><Link to="/dashboard">Dashboard</Link></li>
//           <li><Link to="/students">Students</Link></li>
//           <li><Link to="/rooms">Rooms</Link></li>
//           <li><Link to="/complaints">Complaints</Link></li>
//           <li><Link to="/payments">Payments</Link></li>
//           <li><Link to="/notices">Notices</Link></li>
//         </ul>
//       </nav>
//     </motion.aside>
//   );
// }