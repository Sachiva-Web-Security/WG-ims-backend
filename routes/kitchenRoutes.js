const router = require('express').Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roleAuth');
const ctrl = require('../controllers/kitchenController');

router.use(auth, checkRole(['SUPER_ADMIN', 'ADMIN', 'KITCHEN_USER']));

router.get('/inventory', ctrl.getInventory);
router.put('/inventory/update', ctrl.updateStock);
router.get('/supply-history', ctrl.getSupplyHistory);
router.put('/supply-history/:id/acknowledge', ctrl.acknowledgeSupply);

module.exports = router;
