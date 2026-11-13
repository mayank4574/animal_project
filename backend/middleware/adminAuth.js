const jwt = require('jsonwebtoken');

module.exports = function adminAuth(req, res, next) {
  const adminKey = req.headers['x-admin-key'];
  const expectedKey = process.env.ADMIN_KEY || 'practo-admin-secure-key-2024';

  // 1. Check direct admin API key
  if (adminKey && adminKey === expectedKey) {
    req.admin = { email: process.env.ADMIN_EMAIL || 'admin@practoforanimals.com', role: 'admin' };
    return next();
  }

  // 2. Check Bearer JWT token
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'practo-jwt-secret-key-2024');
      req.admin = decoded;
      return next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Invalid or expired admin token',
      });
    }
  }

  return res.status(401).json({
    success: false,
    message: 'Unauthorized: Admin authentication required to access this resource',
  });
};
