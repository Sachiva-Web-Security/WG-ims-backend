const db = require('./db');

async function migrate() {
  try {
    console.log('Starting migration: Adding is_acknowledged to supply_log...');
    await db.query(`
      ALTER TABLE supply_log 
      ADD COLUMN is_acknowledged BOOLEAN DEFAULT FALSE,
      ADD COLUMN acknowledged_at TIMESTAMP NULL,
      ADD COLUMN acknowledged_by INT NULL,
      ADD FOREIGN KEY (acknowledged_by) REFERENCES users(id)
    `);
    console.log('Migration successful: is_acknowledged column added.');
    process.exit(0);
  } catch (error) {
    if (error.code === 'ER_DUP_COLUMN') {
      console.log('Migration skipped: is_acknowledged column already exists.');
      process.exit(0);
    } else {
      console.error('Migration failed:', error);
      process.exit(1);
    }
  }
}

migrate();
