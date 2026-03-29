const pool = require('../config/db');

// ─── CART DAO (Data Access Object) ────────────────────────────────────────────
// All queries use parameterized inputs ($1, $2, ...) to prevent SQL injection.

/**
 * Get all cart items for a user, joined with product details.
 * @param {string} userId - User UUID
 * @returns {Array} Cart items with product info (name, price, image)
 */
const getCartByUserId = async (userId) => {
  const query = `
    SELECT
      ci.id AS cart_item_id,
      ci.quantity,
      ci.created_at,
      p.id AS product_id,
      p.title AS name,
      p.price,
      p.image_urls,
      p.stock_quantity,
      (p.price * ci.quantity) AS item_total
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = $1
    ORDER BY ci.created_at DESC
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

/**
 * Add a product to the user's cart.
 * If the product already exists in the cart, increment the quantity instead.
 * @param {string} userId - User UUID
 * @param {string} productId - Product UUID
 * @param {number} quantity - Quantity to add (defaults to 1)
 * @returns {Object} The inserted or updated cart item row
 */
const addToCart = async (userId, productId, quantity = 1) => {
  // Check if item already exists in the user's cart
  const checkQuery = 'SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2';
  const existing = await pool.query(checkQuery, [userId, productId]);

  if (existing.rows.length > 0) {
    // Update quantity if already in cart
    const updateQuery = `
      UPDATE cart_items
      SET quantity = quantity + $1
      WHERE user_id = $2 AND product_id = $3
      RETURNING *
    `;
    const result = await pool.query(updateQuery, [quantity, userId, productId]);
    return result.rows[0];
  }

  // Insert new cart item
  const insertQuery = `
    INSERT INTO cart_items (user_id, product_id, quantity)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const result = await pool.query(insertQuery, [userId, productId, quantity]);
  return result.rows[0];
};

/**
 * Update the quantity of a specific cart item.
 * @param {string} cartItemId - Cart item UUID
 * @param {number} quantity - New quantity
 * @returns {Object|null} Updated cart item or null
 */
const updateCartItemQuantity = async (cartItemId, quantity) => {
  const query = `
    UPDATE cart_items
    SET quantity = $1
    WHERE id = $2
    RETURNING *
  `;
  const result = await pool.query(query, [quantity, cartItemId]);
  return result.rows[0] || null;
};

/**
 * Remove a specific item from the cart.
 * @param {string} cartItemId - Cart item UUID
 * @returns {Object|null} The deleted cart item or null
 */
const removeFromCart = async (cartItemId) => {
  const query = 'DELETE FROM cart_items WHERE id = $1 RETURNING *';
  const result = await pool.query(query, [cartItemId]);
  return result.rows[0] || null;
};

/**
 * Clear all items from a user's cart (e.g., after checkout).
 * @param {string} userId - User UUID
 * @returns {number} Number of rows deleted
 */
const clearCart = async (userId) => {
  const query = 'DELETE FROM cart_items WHERE user_id = $1';
  const result = await pool.query(query, [userId]);
  return result.rowCount;
};

module.exports = {
  getCartByUserId,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
};
