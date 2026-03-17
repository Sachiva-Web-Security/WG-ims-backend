try {
  const mysql = require('mysql2/promise');
  console.log('Successfully required mysql2/promise');
} catch (e) {
  console.error('Failed to require mysql2/promise:', e.message);
}
