const productModel = require('../models/productModel');

// ─── PRODUCT SERVICE LAYER ────────────────────────────────────────────────────
// Contains business logic. Sits between Controllers and Models.
// Controllers call Services → Services call Models (DAOs).

/**
 * Fetch all products with optional search and category filtering.
 * @param {string|null} search - Search keyword for product name (optional)
 * @param {string|null} category - Filter by category (optional)
 * @returns {Array} List of product rows
 */
const fetchAllProducts = async (search, category) => {
  // If a search term is provided, prioritize search over category filter
  if (search) {
    return await productModel.searchProducts(search);
  }
  return await productModel.getAllProducts(category || null);
};

/**
 * Fetch a single product by its ID.
 * Throws an error if the product is not found.
 * @param {string} id - Product UUID
 * @returns {Object} Product row
 */
const fetchProductById = async (id) => {
  const product = await productModel.getProductById(id);
  if (!product) {
    const error = new Error('Product not found');
    error.status = 404;
    throw error;
  }
  return product;
};

module.exports = {
  fetchAllProducts,
  fetchProductById,
};
