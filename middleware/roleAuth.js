/**
 * Usage: router.get('/route', auth, checkRole(['SUPER_ADMIN']), handler)
 * Pass an array of allowed roles.
 */
const checkRole = (roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
  }
  next();
};

module.exports = checkRole;
