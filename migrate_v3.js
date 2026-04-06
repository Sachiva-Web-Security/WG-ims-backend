const db = require('./db');

async function migrate() {
  try {
    console.log('Starting migration: Adding is_acknowledged to supply_log...');
    const [columns] = await db.query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'supply_log'
    `);

    const existingColumns = new Set(columns.map((row) => row.COLUMN_NAME));
    const alterStatements = [];

    if (!existingColumns.has('is_acknowledged')) {
      alterStatements.push('ADD COLUMN is_acknowledged BOOLEAN DEFAULT FALSE');
    }

    if (!existingColumns.has('acknowledged_at')) {
      alterStatements.push('ADD COLUMN acknowledged_at TIMESTAMP NULL');
    }

    if (!existingColumns.has('acknowledged_by')) {
      alterStatements.push('ADD COLUMN acknowledged_by INT NULL');
    }

    if (alterStatements.length > 0) {
      await db.query(`ALTER TABLE supply_log ${alterStatements.join(', ')}`);
    }

    const [foreignKeys] = await db.query(`
      SELECT CONSTRAINT_NAME
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'supply_log'
        AND COLUMN_NAME = 'acknowledged_by'
        AND REFERENCED_TABLE_NAME = 'users'
    `);

    const hasAcknowledgedByColumn = existingColumns.has('acknowledged_by') || alterStatements.some((statement) => statement.includes('acknowledged_by'));

    if (!foreignKeys.length && hasAcknowledgedByColumn) {
      await db.query('ALTER TABLE supply_log ADD FOREIGN KEY (acknowledged_by) REFERENCES users(id)');
    }

    console.log('Migration successful: supply_log acknowledgement columns are in place.');
    process.exit(0);
  } catch (error) {
    if (error.code === 'ER_DUP_COLUMN' || error.code === 'ER_DUP_FIELDNAME') {
      console.log('Migration skipped: supply_log acknowledgement columns already exist.');
      process.exit(0);
    } else {
      console.error('Migration failed:', error);
      process.exit(1);
    }
  }
}

migrate();
