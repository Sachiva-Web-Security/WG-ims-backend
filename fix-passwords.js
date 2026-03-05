

require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./db');

async function fix() {
  const hash = await bcrypt.hash('Password1!', 10);
  console.log('Generated hash:', hash);

  await db.query('UPDATE users SET password_hash = ?', [hash]);
  console.log('✅ All user passwords updated to: Password1!');

  // Verify it works
  const match = await bcrypt.compare('Password1!', hash);
  console.log('✅ Hash verify test:', match ? 'PASSED' : 'FAILED');

  process.exit(0);
}

fix().catch(err => { console.error(err); process.exit(1); });
