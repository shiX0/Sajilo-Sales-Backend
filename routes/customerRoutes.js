const express = require('express');
const customerController = require('../controllers/customerController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', authMiddleware, customerController.createCustomer);
router.get('/', authMiddleware, customerController.getAllCustomers);
router.get('/analytics/', authMiddleware, customerController.getCustomerAnalytics);
router.get('/search', authMiddleware, customerController.searchCustomersByName);
router.get('/:id', authMiddleware, customerController.getCustomerById);
router.put('/update/:id', authMiddleware, customerController.updateCustomer);
router.delete('/delete/:id', authMiddleware, customerController.deleteCustomer);
// router.post('/purchase/:id/purchase', customerController.updatePurchaseHistory);

module.exports = router;