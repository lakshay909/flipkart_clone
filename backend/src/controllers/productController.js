const productService = require('../services/productService');

// ─── PRODUCT CONTROLLER ──────────────────────────────────────────────────────
// Handles HTTP req/res ONLY. All business logic lives in the Service layer.
// Controller → Service → Model (DAO)

/**
 * GET /api/products
 * Supports optional query params: ?search=keyword&category=Electronics
 */
const getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;
    const products = await productService.fetchAllProducts(search, category);
    res.status(200).json(products);
  } catch (err) {
    console.error('ProductController.getProducts error:', err.message);
    res.status(err.status || 500).json({ error: err.message });
  }
};

/**
 * GET /api/products/:id
 */
const getSingleProduct = async (req, res) => {
  try {
    const product = await productService.fetchProductById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    console.error('ProductController.getSingleProduct error:', err.message);
    res.status(err.status || 500).json({ error: err.message });
  }
};

module.exports = {
  getProducts,
  getSingleProduct,
};
