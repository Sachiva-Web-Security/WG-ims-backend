require('dotenv').config();
const db = require('./db');

async function addColumn() {
    try {
        await db.query('ALTER TABLE supply_log ADD COLUMN is_acknowledged BOOLEAN DEFAULT FALSE;');
        console.log('Successfully added is_acknowledged column to supply_log table');
    } catch (err) {
        console.error('Failed to add column:', err);
    } finally {
        process.exit();
    }
}

addColumn();
