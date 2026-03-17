const path = require('path');
const base = '/Users/apple/Desktop/S T P L/Sachiva/WG inventory /wavagrill-ims/backend';
try {
  const mysql = require(path.join(base, 'node_modules/mysql2/promise.js'));
  console.log('Successfully required mysql2/promise via explicit path');
} catch (e) {
  console.error('Failed to require mysql2/promise via explicit path:', e.message);
}
