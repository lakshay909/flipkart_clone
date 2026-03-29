const cartModel = require('../models/cartModel');

// ─── CART SERVICE LAYER ───────────────────────────────────────────────────────
// Contains business logic. Sits between Controllers and Models.
// Controllers call Services → Services call Models (DAOs).

/**
 * Fetch all cart items for a given user with product details.
 * @param {string} userId - User ID
 * @returns {Array} Cart items with product info
 */
const fetchCartItems = async (userId) => {
  return await cartModel.getCartByUserId(userId);
};

/**
 * Add a product to the user's cart, or increment quantity if it already exists.
 * @param {string} userId - User ID
 * @param {string} productId - Product ID
 * @param {number} quantity - Quantity to add
 * @returns {Object} The created or updated cart item
 */
const addOrUpdateCartItem = async (userId, productId, quantity) => {
  if (!productId) {
    const error = new Error('product_id is required');
    error.status = 400;
    throw error;
  }
  return await cartModel.addToCart(userId, productId, quantity || 1);
};

/**
 * Update the quantity of a specific cart item.
 * @param {string} cartItemId - Cart item ID
 * @param {number} quantity - New quantity value
 * @returns {Object} The updated cart item
 */
const modifyItemQuantity = async (cartItemId, quantity) => {
  if (!quantity || quantity < 1) {
    const error = new Error('Valid quantity (>= 1) is required');
    error.status = 400;
    throw error;
  }
  const item = await cartModel.updateCartItemQuantity(cartItemId, quantity);
  if (!item) {
    const error = new Error('Cart item not found');
    error.status = 404;
    throw error;
  }
  return item;
};

/**
 * Remove a specific item from the cart.
 * @param {string} cartItemId - Cart item ID
 * @returns {Object} The deleted cart item
 */
const removeItemFromCart = async (cartItemId) => {
  const item = await cartModel.removeFromCart(cartItemId);
  if (!item) {
    const error = new Error('Cart item not found');
    error.status = 404;
    throw error;
  }
  return item;
};

module.exports = {
  fetchCartItems,
  addOrUpdateCartItem,
  modifyItemQuantity,
  removeItemFromCart,
};
