const bcrypt = require('bcryptjs');
const db = require('../db');

// ── Stats ──────────────────────────────────────────────────────────────────
exports.getStats = async (req, res) => {
  const [[{ total_users }]] = await db.query('SELECT COUNT(*) AS total_users FROM users WHERE is_active=1');
  const [[{ total_locations }]] = await db.query('SELECT COUNT(*) AS total_locations FROM locations WHERE is_active=1');
  const [[{ total_ingredients }]] = await db.query('SELECT COUNT(*) AS total_ingredients FROM ingredients WHERE is_active=1');
  const [[{ critical_count }]] = await db.query(
    'SELECT COUNT(*) AS critical_count FROM location_inventory WHERE current_quantity < (max_quantity * 0.4)'
  );
  res.json({ total_users, total_locations, total_ingredients, critical_count });
};

// ── Users ──────────────────────────────────────────────────────────────────
exports.getUsers = async (req, res) => {
  const [rows] = await db.query(`
    SELECT u.id, u.name, u.email, u.role, u.is_active, u.created_at, l.name AS location_name
    FROM users u LEFT JOIN locations l ON l.id = u.location_id
    ORDER BY u.role, u.name
  `);
  res.json(rows);
};

exports.createUser = async (req, res) => {
  const { name, email, password, role, location_id } = req.body;
  if (!name || !email || !password || !role)
    return res.status(400).json({ error: 'name, email, password, role required' });
  if (role === 'KITCHEN_USER' && !location_id)
    return res.status(400).json({ error: 'location_id required for KITCHEN_USER' });

  const hash = await bcrypt.hash(password, 10);
  try {
    const [result] = await db.query(
      'INSERT INTO users (name, email, password_hash, role, location_id) VALUES (?,?,?,?,?)',
      [name, email, hash, role, location_id || null]
    );
    await db.query(
      'INSERT INTO audit_log (user_id, action, target_table, target_id, new_value) VALUES (?,?,?,?,?)',
      [req.user.id, 'USER_CREATED', 'users', result.insertId, JSON.stringify({ name, email, role })]
    );
    res.status(201).json({ id: result.insertId, message: 'User created' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email already exists' });
    throw err;
  }
};

exports.updateUser = async (req, res) => {
  const { name, email, role, location_id, is_active } = req.body;
  await db.query(
    'UPDATE users SET name=?, email=?, role=?, location_id=?, is_active=? WHERE id=?',
    [name, email, role, location_id || null, is_active, req.params.id]
  );
  await db.query(
    'INSERT INTO audit_log (user_id, action, target_table, target_id, new_value) VALUES (?,?,?,?,?)',
    [req.user.id, 'USER_UPDATED', 'users', req.params.id, JSON.stringify({ name, email, role, is_active })]
  );
  res.json({ message: 'User updated' });
};

exports.deactivateUser = async (req, res) => {
  await db.query('UPDATE users SET is_active = 0 WHERE id = ?', [req.params.id]);
  await db.query(
    'INSERT INTO audit_log (user_id, action, target_table, target_id) VALUES (?,?,?,?)',
    [req.user.id, 'USER_DEACTIVATED', 'users', req.params.id]
  );
  res.json({ message: 'User deactivated' });
};

exports.resetPassword = async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword) return res.status(400).json({ error: 'newPassword required' });
  const hash = await bcrypt.hash(newPassword, 10);
  await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [hash, req.params.id]);
  await db.query(
    'INSERT INTO audit_log (user_id, action, target_table, target_id) VALUES (?,?,?,?)',
    [req.user.id, 'PASSWORD_RESET', 'users', req.params.id]
  );
  res.json({ message: 'Password reset' });
};

// ── Locations ──────────────────────────────────────────────────────────────
exports.getLocations = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM locations ORDER BY id');
  res.json(rows);
};

exports.createLocation = async (req, res) => {
  const { location_code, name } = req.body;
  if (!location_code || !name)
    return res.status(400).json({ error: 'location_code and name required' });
  const [result] = await db.query(
    'INSERT INTO locations (location_code, name) VALUES (?,?)', [location_code, name]
  );
  await db.query(
    'INSERT INTO audit_log (user_id, action, target_table, target_id, new_value) VALUES (?,?,?,?,?)',
    [req.user.id, 'LOCATION_CREATED', 'locations', result.insertId, JSON.stringify({ location_code, name })]
  );
  res.status(201).json({ id: result.insertId, message: 'Location created' });
};

exports.updateLocation = async (req, res) => {
  const { name, is_active } = req.body;
  await db.query('UPDATE locations SET name=?, is_active=? WHERE id=?', [name, is_active, req.params.id]);
  res.json({ message: 'Location updated' });
};

// ── Ingredients (Super Admin full control) ─────────────────────────────────
exports.getIngredients = async (req, res) => {
  const [rows] = await db.query(
    'SELECT * FROM ingredients WHERE is_active=1 ORDER BY name'
  );
  res.json(rows);
};

exports.createIngredient = async (req, res) => {
  const { name, unit } = req.body;
  if (!name || !unit) return res.status(400).json({ error: 'name and unit required' });

  const [result] = await db.query(
    'INSERT INTO ingredients (name, unit, created_by) VALUES (?,?,?)',
    [name, unit, req.user.id]
  );
  // Auto-create location_inventory rows for all active locations
  const [locations] = await db.query('SELECT id FROM locations WHERE is_active=1');
  for (const loc of locations) {
    await db.query(
      'INSERT IGNORE INTO location_inventory (location_id, ingredient_id, max_quantity, min_quantity) VALUES (?,?,0,0)',
      [loc.id, result.insertId]
    );
  }
  await db.query(
    'INSERT INTO audit_log (user_id, action, target_table, target_id, new_value) VALUES (?,?,?,?,?)',
    [req.user.id, 'INGREDIENT_CREATED', 'ingredients', result.insertId, JSON.stringify({ name, unit })]
  );
  res.status(201).json({ id: result.insertId, message: 'Ingredient created' });
};

exports.deactivateIngredient = async (req, res) => {
  await db.query('UPDATE ingredients SET is_active=0 WHERE id=?', [req.params.id]);
  await db.query(
    'INSERT INTO audit_log (user_id, action, target_table, target_id) VALUES (?,?,?,?)',
    [req.user.id, 'INGREDIENT_DEACTIVATED', 'ingredients', req.params.id]
  );
  res.json({ message: 'Ingredient deactivated' });
};

// ── Stock Config (max + min qty — Super Admin ONLY) ────────────────────────
// GET /api/super-admin/stock-config/:locId
exports.getStockConfig = async (req, res) => {
  const [rows] = await db.query(`
    SELECT li.ingredient_id, li.max_quantity, li.min_quantity,
           li.current_quantity, li.already_supplied,
           i.name AS ingredient_name, i.unit
    FROM location_inventory li
    JOIN ingredients i ON i.id = li.ingredient_id
    WHERE li.location_id = ? AND i.is_active = 1
    ORDER BY i.name
  `, [req.params.locId]);
  res.json(rows);
};

// PUT /api/super-admin/stock-config/:locId/:ingId
exports.setStockLimits = async (req, res) => {
  const { max_quantity, min_quantity } = req.body;
  const old = await db.query(
    'SELECT max_quantity, min_quantity FROM location_inventory WHERE location_id=? AND ingredient_id=?',
    [req.params.locId, req.params.ingId]
  );
  await db.query(
    'UPDATE location_inventory SET max_quantity=?, min_quantity=? WHERE location_id=? AND ingredient_id=?',
    [max_quantity, min_quantity ?? 0, req.params.locId, req.params.ingId]
  );
  await db.query(
    'INSERT INTO audit_log (user_id, action, target_table, old_value, new_value) VALUES (?,?,?,?,?)',
    [req.user.id, 'STOCK_LIMITS_SET', 'location_inventory',
    JSON.stringify({ loc: req.params.locId, ing: req.params.ingId, old: old[0] }),
    JSON.stringify({ max_quantity, min_quantity })]
  );
  res.json({ message: 'Stock limits updated' });
};

// ── Chart Data ─────────────────────────────────────────────────────────────
// GET /api/super-admin/chart-data
exports.getChartData = async (req, res) => {
  const [locations] = await db.query('SELECT * FROM locations WHERE is_active=1 ORDER BY id');
  const result = [];
  for (const loc of locations) {
    const [inv] = await db.query(`
      SELECT i.name AS ingredient_name, i.unit,
             li.current_quantity, li.max_quantity, li.min_quantity, li.already_supplied,
             CASE
               WHEN li.current_quantity >= (li.max_quantity * 0.8)                                THEN 'OK'
               WHEN li.current_quantity BETWEEN (li.max_quantity*0.4) AND (li.max_quantity*0.79)   THEN 'LOW'
               ELSE 'CRITICAL'
             END AS status
      FROM location_inventory li
      JOIN ingredients i ON i.id = li.ingredient_id
      WHERE li.location_id = ? AND i.is_active = 1
      ORDER BY i.name
    `, [loc.id]);
    result.push({
      id: loc.id,
      location: loc.name,
      code: loc.location_code,
      inventory: inv
    });
  }
  res.json(result);
};

// ── Audit Log ──────────────────────────────────────────────────────────────
exports.getAuditLog = async (req, res) => {
  const limit = parseInt(req.query.limit) || 100;
  const [rows] = await db.query(`
    SELECT al.*, u.name AS user_name, u.role AS user_role
    FROM audit_log al JOIN users u ON u.id = al.user_id
    ORDER BY al.created_at DESC LIMIT ?
  `, [limit]);
  res.json(rows);
};
