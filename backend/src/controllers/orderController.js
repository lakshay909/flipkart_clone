const orderService = require('../services/orderService');
const { sendOrderConfirmationEmail } = require('../utils/sendEmail');

// Hardcoded userId for now (will be replaced with auth middleware later)
const userId = 1;

/**
 * POST /api/orders
 * Body: { shipping_address, total_amount (optional, calculated by service usually) }
 */
const createOrder = async (req, res) => {
  try {
    const { shipping_address, user_email } = req.body;
    const order = await orderService.processNewOrder(userId, shipping_address);

    // ── Send confirmation email (fire-and-forget, never blocks the order) ──
    const recipientEmail = user_email || process.env.EMAIL_USER;
    try {
      await sendOrderConfirmationEmail(recipientEmail, {
        orderId: order.id || order.order_id,
        totalAmount: order.total_amount,
        shippingAddress: shipping_address,
        items: order.items || [],
      });
    } catch (emailErr) {
      // Email failed — log it but do NOT fail the order response
      console.error('⚠️  Order confirmation email failed (order still created):', emailErr.message);
    }

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
