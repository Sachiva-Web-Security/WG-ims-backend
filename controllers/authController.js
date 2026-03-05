const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log(`[AUTH] Login attempt for: ${email}`);
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password required' });

  try {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ? AND is_active = 1', [email]
    );
    if (!rows.length)
      return res.status(401).json({ error: 'Invalid credentials' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      console.warn(`[AUTH] Invalid password for: ${email}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role, location_id: user.location_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    // Audit log
    await db.query(
      'INSERT INTO audit_log (user_id, action) VALUES (?, ?)',
      [user.id, 'LOGIN']
    );

    console.log(`[AUTH] Login successful: ${email} (Role: ${user.role})`);

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, location_id: user.location_id }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/auth/me
exports.me = async (req, res) => {
  console.log(`[AUTH] Get current user for ID: ${req.user.id}`);
  const [rows] = await db.query(
    'SELECT id, name, email, role, location_id FROM users WHERE id = ?', [req.user.id]
  );
  res.json(rows[0] || {});
};

// POST /api/auth/change-password
exports.changePassword = async (req, res) => {
  console.log(`[AUTH] Change password request for ID: ${req.user.id}`);
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword)
    return res.status(400).json({ error: 'Both passwords required' });

  const [rows] = await db.query('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
  const match = await bcrypt.compare(currentPassword, rows[0].password_hash);
  if (!match) return res.status(400).json({ error: 'Current password incorrect' });

  const hash = await bcrypt.hash(newPassword, 10);
  await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [hash, req.user.id]);
  res.json({ message: 'Password updated' });
};
