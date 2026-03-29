const cartService = require('../services/cartService');

// ─── CART CONTROLLER ─────────────────────────────────────────────────────────
// Handles HTTP req/res ONLY. All business logic lives in the Service layer.
// Controller → Service → Model (DAO)

// Hardcoded userId for now (will be replaced with auth middleware later)
const userId = 1;

/**
 * GET /api/cart
 */
const getCart = async (req, res) => {
  try {
    const items = await cartService.fetchCartItems(userId);
    res.status(200).json(items);
  } catch (err) {
    console.error('CartController.getCart error:', err.message);
    res.status(err.status || 500).json({ error: err.message });
  }
};

/**
 * POST /api/cart
 * Body: { product_id, quantity }
 */
const addItemToCart = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    const item = await cartService.addOrUpdateCartItem(userId, product_id, quantity);
    res.status(201).json(item);
  } catch (err) {
    console.error('CartController.addItemToCart error:', err.message);
    res.status(err.status || 500).json({ error: err.message });
  }
};

/**
 * PUT /api/cart/:cartItemId
 * Body: { quantity }
 */
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const item = await cartService.modifyItemQuantity(req.params.cartItemId, quantity);
    res.status(200).json(item);
  } catch (err) {
    console.error('CartController.updateCartItem error:', err.message);
    res.status(err.status || 500).json({ error: err.message });
  }
};

/**
 * DELETE /api/cart/:cartItemId
 */
const removeCartItem = async (req, res) => {
  try {
    const item = await cartService.removeItemFromCart(req.params.cartItemId);
    res.status(200).json({ message: 'Item removed from cart', item });
  } catch (err) {
    console.error('CartController.removeCartItem error:', err.message);
    res.status(err.status || 500).json({ error: err.message });
  }
};

module.exports = {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
};
