const db = require('../db');

exports.getInventory = async (req, res) => {
  const locationId = req.user.location_id;
  if (!locationId) return res.status(403).json({ error: 'No location assigned' });

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
  `, [locationId]);

  const [[loc]] = await db.query('SELECT * FROM locations WHERE id=?', [locationId]);
  res.json({ location: loc, inventory: rows });
};

exports.updateStock = async (req, res) => {
  const locationId = req.user.location_id;
  const { updates } = req.body;
  if (!updates?.length) return res.status(400).json({ error: 'updates array required' });

  for (const item of updates) {
    const [old] = await db.query(
      'SELECT current_quantity FROM location_inventory WHERE location_id=? AND ingredient_id=?',
      [locationId, item.ingredient_id]
    );
    await db.query(
      'UPDATE location_inventory SET current_quantity=?, updated_by=? WHERE location_id=? AND ingredient_id=?',
      [item.current_quantity, req.user.id, locationId, item.ingredient_id]
    );
    await db.query(
      'INSERT INTO audit_log (user_id, action, target_table, old_value, new_value) VALUES (?,?,?,?,?)',
      [req.user.id, 'STOCK_UPDATE', 'location_inventory',
      JSON.stringify({ ingredient_id: item.ingredient_id, old: old[0]?.current_quantity }),
      JSON.stringify({ current_quantity: item.current_quantity })]
    );
  }
  res.json({ message: 'Stock updated successfully' });
};

exports.getSupplyHistory = async (req, res) => {
  const locationId = req.user.location_id;
  const [rows] = await db.query(`
    SELECT sl.quantity_dispatched, sl.dispatched_at, sl.notes,
           i.name AS ingredient_name, i.unit
    FROM supply_log sl
    JOIN ingredients i ON i.id = sl.ingredient_id
    WHERE sl.location_id = ?
    ORDER BY sl.dispatched_at DESC LIMIT 50
  `, [locationId]);
  res.json(rows);
};
