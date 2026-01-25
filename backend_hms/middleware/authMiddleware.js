
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains { id: ..., role: ... }
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

const isAdmin = async (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ msg: "Access denied. Admins only." });
  next();
};

module.exports = { verifyToken, isAdmin};

// const jwt = require('jsonwebtoken');

// module.exports = function (req, res, next) {
//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   if (!token) {
//     return res.status(401).json({ message: 'Access denied. No token provided.' });
//   }

//   try {
//     const decoded = jwt.verify(token, 'your_jwt_secret'); // Replace with your actual secret key

//     if (decoded.role !== 'admin') {
//       return res.status(403).json({ message: 'Only admin can perform this action.' });
//     }

//     req.user = decoded; // Attach user data to the request
//     next();
//   } catch (err) {
//     res.status(400).json({ message: 'Invalid token.' });
//   }
// };
// module.exports = verifyToken;