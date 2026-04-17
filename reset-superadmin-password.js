const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

const NEW_PASSWORD = 'Himanshu@12345!'; // Change this before running

(async () => {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const hash = await bcrypt.hash(NEW_PASSWORD, 10);
  const [result] = await db.execute(
    "UPDATE users SET password_hash = ? WHERE email = 'superadmin@wavagrill.com'",
    [hash]
  );

  if (result.affectedRows === 1) {
    console.log(`Password reset to: ${NEW_PASSWORD}`);
  } else {
    console.log('User not found or no rows updated.');
  }

  await db.end();
})();
