const router = require('express').Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roleAuth');
const ctrl = require('../controllers/superAdminController');

router.use(auth, checkRole(['SUPER_ADMIN']));

// Stats
router.get('/stats', ctrl.getStats);

// Users
router.get('/users', ctrl.getUsers);
router.post('/users', ctrl.createUser);
router.put('/users/:id', ctrl.updateUser);
router.put('/users/:id/deactivate', ctrl.deactivateUser);
router.post('/users/:id/reset-password', ctrl.resetPassword);

// Locations
router.get('/locations', ctrl.getLocations);
router.post('/locations', ctrl.createLocation);
router.put('/locations/:id', ctrl.updateLocation);

// Ingredients (Super Admin full control)
router.get('/ingredients', ctrl.getIngredients);
router.post('/ingredients', ctrl.createIngredient);
router.put('/ingredients/:id/deactivate', ctrl.deactivateIngredient);

// Stock Config — max/min qty (Super Admin ONLY)
router.get('/stock-config/:locId', ctrl.getStockConfig);
router.put('/stock-config/:locId/:ingId', ctrl.setStockLimits);

// Chart data
router.get('/chart-data', ctrl.getChartData);

// Audit log
router.get('/audit-log', ctrl.getAuditLog);

module.exports = router;
