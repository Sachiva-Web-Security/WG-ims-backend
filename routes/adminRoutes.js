const router = require('express').Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roleAuth');
const ctrl = require('../controllers/adminController');

const ADMIN = ['SUPER_ADMIN', 'ADMIN'];
router.use(auth, checkRole(ADMIN));

router.get('/dashboard', ctrl.getDashboard);
router.get('/locations', ctrl.getLocations);
router.get('/locations/:id/inventory', ctrl.getLocationInventory);
router.get('/ingredients', ctrl.getIngredients);
router.post('/ingredients', ctrl.createIngredient);
router.delete('/ingredients/:id', ctrl.deactivateIngredient);
router.post('/supply/dispatch', ctrl.dispatchSupply);
router.get('/supply/history', ctrl.getSupplyHistory);

module.exports = router;
