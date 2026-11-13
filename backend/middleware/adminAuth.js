module.exports = function adminAuth(req, res, next) {
  const adminKey = req.headers['x-admin-key'];
  const expectedKey = process.env.ADMIN_KEY || 'practo-admin-secure-key-2024';

  if (!adminKey || adminKey !== expectedKey) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Admin key required to view business listing submissions',
    });
  }

  next();
};

