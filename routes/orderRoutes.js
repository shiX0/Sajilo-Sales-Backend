const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// Get all orders
router.get('/', authMiddleware, orderController.getAllOrders);
// analytics
router.get('/analytics', authMiddleware, orderController.getSalesAnalytics);
// Get a single order by ID
router.get('/:id', authMiddleware, orderController.getOrderById);

// Create a new order
router.post('/create', authMiddleware, orderController.createOrder);

// Update an order
router.put('/:id', authMiddleware, orderController.updateOrder);

// Delete an order
router.delete('/:id', authMiddleware, orderController.deleteOrder);

module.exports = router;