require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');
const adminRoutes = require('./routes/adminRoutes');
const kitchenRoutes = require('./routes/kitchenRoutes');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3030',
  'http://www.Inventory.wavagrill.com',
  'https://www.Inventory.wavagrill.com',
  'www.Inventory.wavagrill.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
// Global Request Logger
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/kitchen', kitchenRoutes);

// Health check
app.get('/api/health', (_, res) => {
  console.log('[HEALTH] Health check request');
  res.json({ status: 'OK', app: 'WavaGrill IMS' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`WavaGrill IMS API running on port ${PORT}`));
