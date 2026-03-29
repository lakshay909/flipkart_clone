const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// ─── ORDER ROUTES ──────────────────────────────────────────────────────────

// POST /api/orders - Create a new order from cart
router.post('/', orderController.createOrder);

// GET /api/orders - Get all orders for the current user
router.get('/', orderController.getOrders);

// GET /api/orders/:orderId - Get details of a specific order
router.get('/:orderId', orderController.getOrderById);

module.exports = router;
