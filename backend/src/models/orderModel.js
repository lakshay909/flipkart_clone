const pool = require('../config/db');

// ─── ORDER DAO (Data Access Object) ──────────────────────────────────────────
// All queries use parameterized inputs ($1, $2, ...) to prevent SQL injection.
// Order creation uses a TRANSACTION to ensure atomicity.

/**
 * Create a new order from the user's current cart.
 * Uses a database transaction to ensure all-or-nothing execution:
 *   1. Fetch cart items with product prices
 *   2. Calculate total amount
 *   3. Insert into orders table
 *   4. Insert each cart item into order_items with price_at_purchase
 *   5. Clear the user's cart
 * @param {string} userId - User UUID
 * @param {string} shippingAddress - Delivery address
 * @returns {Object} The created order with its items
 */
const createOrderFromCart = async (userId, shippingAddress) => {
  const client = await pool.connect(); // Get a dedicated client for the transaction

  try {
    await client.query('BEGIN');

    // 1. Fetch the user's cart with product prices
    const cartQuery = `
      SELECT ci.product_id, ci.quantity, p.price, p.title AS name
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = $1
    `;
    const cartResult = await client.query(cartQuery, [userId]);

    if (cartResult.rows.length === 0) {
      throw new Error('Cart is empty. Cannot place order.');
    }

    const cartItems = cartResult.rows;

    // 2. Calculate total amount
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    );

    // 3. Insert the order
    const orderQuery = `
      INSERT INTO orders (user_id, total_amount, shipping_address, status)
      VALUES ($1, $2, $3, 'pending')
      RETURNING *
    `;
    const orderResult = await client.query(orderQuery, [userId, totalAmount, shippingAddress]);
    const order = orderResult.rows[0];

    // 4. Insert each cart item into order_items
    const orderItemsInsertQuery = `
      INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const orderItems = [];
    for (const item of cartItems) {
      const result = await client.query(orderItemsInsertQuery, [
        order.id,
        item.product_id,
        item.quantity,
        item.price,
      ]);
      orderItems.push(result.rows[0]);
    }

    // 5. Clear the user's cart after successful order
    await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

    await client.query('COMMIT');

    return { ...order, items: orderItems };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

/**
 * Get all orders for a specific user.
 * @param {string} userId - User UUID
 * @returns {Array} List of order rows
 */
const getOrdersByUserId = async (userId) => {
  const query = 'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC';
  const result = await pool.query(query, [userId]);
  return result.rows;
};

/**
 * Get a single order with its items and product details.
 * @param {string} orderId - Order UUID
 * @returns {Object|null} Order with nested items array, or null
 */
const getOrderById = async (orderId) => {
  const orderQuery = 'SELECT * FROM orders WHERE id = $1';
  const orderResult = await pool.query(orderQuery, [orderId]);

  if (orderResult.rows.length === 0) return null;

  const order = orderResult.rows[0];

  const itemsQuery = `
    SELECT oi.*, p.name, p.image_url
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = $1
  `;
  const itemsResult = await pool.query(itemsQuery, [orderId]);

  return { ...order, items: itemsResult.rows };
};

/**
 * Update the status of an order (e.g., pending → shipped → delivered).
 * @param {string} orderId - Order UUID
 * @param {string} status - New status value
 * @returns {Object|null} Updated order or null
 */
const updateOrderStatus = async (orderId, status) => {
  const query = 'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *';
  const result = await pool.query(query, [status, orderId]);
  return result.rows[0] || null;
};

module.exports = {
  createOrderFromCart,
  getOrdersByUserId,
  getOrderById,
  updateOrderStatus,
};
