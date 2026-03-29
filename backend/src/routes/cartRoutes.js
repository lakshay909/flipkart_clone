const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// ─── CART ROUTES ─────────────────────────────────────────────────────────────
// Route → Controller → Service → Model (DAO)

// GET    /api/cart                 — Get all cart items for the user
router.get('/', cartController.getCart);

// POST   /api/cart                 — Add an item to the cart
router.post('/', cartController.addItemToCart);

// PUT    /api/cart/:cartItemId     — Update quantity of a cart item
router.put('/:cartItemId', cartController.updateCartItem);

// DELETE /api/cart/:cartItemId     — Remove an item from the cart
router.delete('/:cartItemId', cartController.removeCartItem);

module.exports = router;
