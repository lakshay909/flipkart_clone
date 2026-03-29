const orderModel = require('../models/orderModel');

// ─── ORDER SERVICE LAYER ─────────────────────────────────────────────────────
// Contains business logic. Sits between Controllers and Models.
// Controllers call Services → Services call Models (DAOs).

/**
 * Process a new order from the user's cart.
 * Validates the shipping address, then delegates to the model's
 * transactional createOrderFromCart function.
 * @param {string} userId - User ID
 * @param {string} shippingAddress - Delivery address
 * @returns {Object} The created order with its items
 */
const processNewOrder = async (userId, shippingAddress) => {
  if (!shippingAddress || shippingAddress.trim() === '') {
    const error = new Error('Shipping address is required');
    error.status = 400;
    throw error;
  }
  return await orderModel.createOrderFromCart(userId, shippingAddress);
};

/**
 * Get all orders for a specific user.
 * @param {string} userId - User ID
 * @returns {Array} List of order rows
 */
const fetchUserOrders = async (userId) => {
  return await orderModel.getOrdersByUserId(userId);
};

/**
 * Get a single order with its items.
 * @param {string} orderId - Order ID
 * @returns {Object} Order with nested items
 */
const fetchOrderDetails = async (orderId) => {
  const order = await orderModel.getOrderById(orderId);
  if (!order) {
    const error = new Error('Order not found');
    error.status = 404;
    throw error;
  }
  return order;
};

module.exports = {
  processNewOrder,
  fetchUserOrders,
  fetchOrderDetails,
};
