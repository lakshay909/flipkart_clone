const express = require('express');
const router = express.Router();
const { getWishlist, toggleWishlist } = require('../controllers/wishlistController');

// GET all wishlist items for the hardcoded user
router.get('/', getWishlist);

// POST toggle an item in the wishlist
router.post('/toggle', toggleWishlist);

module.exports = router;
