const pool = require('../config/db');

// Hardcoded user ID since there is no authentication system
const userId = 1;

// GET /api/wishlist
const getWishlist = async (req, res) => {
  try {
    const query = `
      SELECT p.* 
      FROM products p 
      JOIN wishlists w ON p.id = w.product_id 
      WHERE w.user_id = $1
    `;
    const result = await pool.query(query, [userId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
};

// POST /api/wishlist/toggle
const toggleWishlist = async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ error: 'productId is required' });
  }

  try {
    // Check if the item is already wishlisted
    const checkQuery = `SELECT * FROM wishlists WHERE user_id = $1 AND product_id = $2`;
    const checkResult = await pool.query(checkQuery, [userId, productId]);

    if (checkResult.rows.length > 0) {
      // Item exists -> Delete it
      const deleteQuery = `DELETE FROM wishlists WHERE user_id = $1 AND product_id = $2`;
      await pool.query(deleteQuery, [userId, productId]);
      return res.status(200).json({ isWishlisted: false });
    } else {
      // Item does NOT exist -> Insert it
      const insertQuery = `INSERT INTO wishlists (user_id, product_id) VALUES ($1, $2)`;
      await pool.query(insertQuery, [userId, productId]);
      return res.status(201).json({ isWishlisted: true });
    }
  } catch (error) {
    console.error('Error toggling wishlist:', error);
    res.status(500).json({ error: 'Failed to toggle wishlist' });
  }
};

module.exports = {
  getWishlist,
  toggleWishlist,
};
