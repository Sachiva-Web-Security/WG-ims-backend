const db = require('./db');

async function check() {
  try {
    const [tables] = await db.query('SHOW TABLES');
    console.log('Tables in database:', JSON.stringify(tables, null, 2));
    
    for (const tableRow of tables) {
      const tableName = Object.values(tableRow)[0];
      const [columns] = await db.query(`DESCRIBE ${tableName}`);
      console.log(`Columns in ${tableName}:`, JSON.stringify(columns, null, 2));
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit();
  }
}

check();
