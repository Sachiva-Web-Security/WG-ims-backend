const db = require('../db');

// ── Dashboard ──────────────────────────────────────────────────────────────
exports.getDashboard = async (req, res) => {
  const [locations] = await db.query(`
    SELECT l.id, l.name, l.location_code,
      COUNT(li.id)                                                  AS total_items,
      SUM(li.current_quantity < (li.max_quantity * 0.4))            AS critical_count,
      SUM(li.current_quantity BETWEEN (li.max_quantity*0.4) AND (li.max_quantity*0.79)) AS low_count,
      SUM(li.current_quantity >= (li.max_quantity * 0.8))           AS ok_count,
      MAX(li.updated_at)                                            AS last_updated
    FROM locations l
    LEFT JOIN location_inventory li ON li.location_id = l.id
    WHERE l.is_active = 1
    GROUP BY l.id ORDER BY l.id
  `);
  res.json(locations);
};

// ── Location Inventory (read only — max/min set by Super Admin) ────────────
exports.getLocationInventory = async (req, res) => {
  const [rows] = await db.query(`
    SELECT li.id, i.name AS ingredient_name, i.unit, i.id AS ingredient_id,
           li.max_quantity, li.min_quantity, li.current_quantity, li.already_supplied,
           (li.max_quantity - li.current_quantity) AS gap,
           CASE
             WHEN li.current_quantity >= (li.max_quantity * 0.8)                               THEN 'OK'
             WHEN li.current_quantity BETWEEN (li.max_quantity*0.4) AND (li.max_quantity*0.79)  THEN 'LOW'
             ELSE 'CRITICAL'
           END AS status,
           li.updated_at
    FROM location_inventory li
    JOIN ingredients i ON i.id = li.ingredient_id
    WHERE li.location_id = ? AND i.is_active = 1
    ORDER BY i.name
  `, [req.params.id]);
  res.json(rows);
};

// ── Ingredients (Admin can view + add — max/min controlled by SA) ──────────
exports.getIngredients = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM ingredients WHERE is_active=1 ORDER BY name');
  res.json(rows);
};

exports.createIngredient = async (req, res) => {
  const { name, unit } = req.body;
  if (!name || !unit) return res.status(400).json({ error: 'name and unit required' });
  const [result] = await db.query(
    'INSERT INTO ingredients (name, unit, created_by) VALUES (?,?,?)',
    [name, unit, req.user.id]
  );
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
  res.json({ message: 'Ingredient deactivated' });
};

// ── Supply Dispatch ────────────────────────────────────────────────────────
exports.dispatchSupply = async (req, res) => {
  const { location_id, ingredient_id, quantity, notes } = req.body;
  if (!location_id || !ingredient_id || !quantity)
    return res.status(400).json({ error: 'location_id, ingredient_id, quantity required' });

  const [result] = await db.query(
    'INSERT INTO supply_log (location_id, ingredient_id, quantity_dispatched, dispatched_by, notes) VALUES (?,?,?,?,?)',
    [location_id, ingredient_id, quantity, req.user.id, notes || null]
  );
  await db.query(
    'UPDATE location_inventory SET already_supplied = already_supplied + ? WHERE location_id=? AND ingredient_id=?',
    [quantity, location_id, ingredient_id]
  );
  const [[ing]] = await db.query('SELECT name FROM ingredients WHERE id=?', [ingredient_id]);
  const [[loc]] = await db.query('SELECT name FROM locations WHERE id=?', [location_id]);
  await db.query(
    'INSERT INTO audit_log (user_id, action, target_table, target_id, new_value) VALUES (?,?,?,?,?)',
    [req.user.id, 'SUPPLY_DISPATCHED', 'supply_log', result.insertId,
     JSON.stringify({ ingredient: ing.name, location: loc.name, quantity })]
  );
  res.status(201).json({ message: 'Supply dispatched', id: result.insertId });
};

exports.getSupplyHistory = async (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const [rows] = await db.query(`
    SELECT sl.*, i.name AS ingredient_name, i.unit, l.name AS location_name, u.name AS dispatched_by_name
    FROM supply_log sl
    JOIN ingredients i ON i.id = sl.ingredient_id
    JOIN locations   l ON l.id = sl.location_id
    JOIN users       u ON u.id = sl.dispatched_by
    ORDER BY sl.dispatched_at DESC LIMIT ?
  `, [limit]);
  res.json(rows);
};

exports.getLocations = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM locations WHERE is_active=1 ORDER BY id');
  res.json(rows);
};
