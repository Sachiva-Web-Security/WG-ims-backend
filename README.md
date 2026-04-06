# WavaGrill IMS Backend

Express + MySQL API for WavaGrill IMS.

## Tech Stack

- Node.js + Express
- MySQL (mysql2)
- JWT authentication
- Role-based access control

## Prerequisites

- Node.js 18+ (recommended)
- npm 9+
- MySQL 8+ (or compatible MariaDB)

## Project Structure

- `app.js`: server entry point and route mounting
- `db.js`: MySQL pool connection
- `controllers/`: request handlers
- `routes/`: API routes
- `middleware/`: auth and role checks
- `wavagrill_ims.sql`: base schema + seed data
- `migrate.js`, `migrate_v3.js`, `migrate_v4.js`: schema upgrades

## Environment Setup

1. Copy env template:

```bash
cp .env.example .env
```

2. Configure `.env`:

```env
PORT=5001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=wavagrill_ims
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=8h
```

Notes:
- `PORT` should match your frontend API URL (default frontend expects `5001`).
- Use a strong `JWT_SECRET` in production.

## Database Setup

1. Create database and import schema/data:

```bash
mysql -u root -p < wavagrill_ims.sql
```

2. Run migrations (recommended for existing/older databases):

```bash
node migrate.js
node migrate_v3.js
node migrate_v4.js
```

If a migration says columns already exist, that is usually fine.

## Install and Run

Install dependencies:

```bash
npm install
```

Run in development:

```bash
npm run dev
```

Run in production mode:

```bash
npm start
```

Default API base URL after start:

- `http://localhost:5001/api`

Health endpoint:

- `GET /api/health`

## CORS / Frontend Origin

Allowed origins are configured in `app.js`.

If your frontend URL is different, add it to `allowedOrigins` and restart the backend.

## Useful Scripts

- `npm run dev`: start with nodemon
- `npm start`: start with node

## Common Issues

1. Unknown column errors (for example in acknowledge flow):
- Run migrations (`migrate_v3.js` etc.) against the current DB.

2. `Not allowed by CORS`:
- Add your frontend origin to `allowedOrigins` in `app.js`.

3. `ER_ACCESS_DENIED_ERROR` / DB connection failures:
- Verify `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` in `.env`.

4. Port already in use:
- Change `PORT` in `.env` and update frontend API URL.

## Deployment Notes

Typical PM2 flow:

```bash
npm install
node migrate.js
node migrate_v3.js
node migrate_v4.js
pm2 start app.js --name wavagrill-ims-api
pm2 save
```

When deploying updates:

```bash
pm2 restart wavagrill-ims-api
```
