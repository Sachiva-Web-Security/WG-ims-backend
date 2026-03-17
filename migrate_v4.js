const db = require('./db');

async function migrate() {
  try {
    console.log('Starting migration: Adding batch_id to supply_log...');
    await db.query(`
      ALTER TABLE supply_log 
      ADD COLUMN batch_id VARCHAR(50) NULL AFTER id,
      ADD INDEX (batch_id)
    `);
    console.log('Migration successful: batch_id column added.');
    process.exit(0);
  } catch (error) {
    if (error.code === 'ER_DUP_COLUMN') {
      console.log('Migration skipped: batch_id column already exists.');
      process.exit(0);
    } else {
      console.error('Migration failed:', error);
      process.exit(1);
    }
  }
}

migrate();
