// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Amitisagoodb$oy'
exports.authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
        console.error('Token Validation Error:', err); 
      return res.status(403).json({ error: 'Invalid token' });
    }

    req.userId = user.userId; // Attach userId to the request object
    next();
  });
};
