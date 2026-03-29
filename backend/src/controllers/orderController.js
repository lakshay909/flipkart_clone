const orderService = require('../services/orderService');

// Hardcoded userId for now (will be replaced with auth middleware later)
const userId = 1;

/**
 * POST /api/orders
 * Body: { shipping_address, total_amount (optional, calculated by service usually) }
 */
const createOrder = async (req, res) => {
  try {
    const { shipping_address } = req.body;
    const order = await orderService.processNewOrder(userId, shipping_address);
    res.status(201).json(order);
  } catch (err) {
    console.error('OrderController.createOrder error:', err.message);
    res.status(err.status || 500).json({ error: err.message });
  }
};

/**
 * GET /api/orders
 */
const getOrders = async (req, res) => {
  try {
    const orders = await orderService.fetchUserOrders(userId);
    res.status(200).json(orders);
  } catch (err) {
    console.error('OrderController.getOrders error:', err.message);
    res.status(err.status || 500).json({ error: err.message });
  }
};

/**
 * GET /api/orders/:orderId
 */
const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await orderService.fetchOrderDetails(orderId);
    res.status(200).json(order);
  } catch (err) {
    console.error('OrderController.getOrderById error:', err.message);
    res.status(err.status || 500).json({ error: err.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
};
