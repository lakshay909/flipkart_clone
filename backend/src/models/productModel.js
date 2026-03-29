const pool = require('../config/db');

// ─── PRODUCT DAO (Data Access Object) ─────────────────────────────────────────
// All queries use parameterized inputs ($1, $2, ...) to prevent SQL injection.

/**
 * Fetch all products, optionally filtered by category.
 * @param {string|null} category - Filter by category (optional)
 * @returns {Array} List of product rows
 */
const getAllProducts = async (category) => {
  let query = 'SELECT * FROM products';
  const values = [];

  if (category) {
    query += ' WHERE category = $1';
    values.push(category);
  }

  query += ' ORDER BY created_at DESC';
  const result = await pool.query(query, values);
  return result.rows;
};

/**
 * Fetch a single product by its ID.
 * @param {string} id - Product UUID
 * @returns {Object|null} Product row or null
 */
const getProductById = async (id) => {
  const query = 'SELECT * FROM products WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

/**
 * Search products by name (case-insensitive partial match).
 * @param {string} searchTerm - The search keyword
 * @returns {Array} Matching product rows
 */
const searchProducts = async (searchTerm) => {
  const query = 'SELECT * FROM products WHERE title ILIKE $1 OR description ILIKE $1 ORDER BY created_at DESC';
  const result = await pool.query(query, [`%${searchTerm}%`]);
  return result.rows;
};

/**
 * Insert a new product into the database.
 * @param {Object} product - { name, description, price, stock_quantity, category, image_url }
 * @returns {Object} The newly created product row
 */
const createProduct = async ({ name, description, price, stock_quantity, category, image_url }) => {
  const query = `
    INSERT INTO products (name, description, price, stock_quantity, category, image_url)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const values = [name, description, price, stock_quantity, category, image_url];
  const result = await pool.query(query, values);
  return result.rows[0];
};

/**
 * Update an existing product.
 * @param {string} id - Product UUID
 * @param {Object} fields - { name, description, price, stock_quantity, category, image_url }
 * @returns {Object|null} The updated product row or null
 */
const updateProduct = async (id, { name, description, price, stock_quantity, category, image_url }) => {
  const query = `
    UPDATE products
    SET name = $1, description = $2, price = $3, stock_quantity = $4, category = $5, image_url = $6
    WHERE id = $7
    RETURNING *
  `;
  const values = [name, description, price, stock_quantity, category, image_url, id];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

/**
 * Delete a product by its ID.
 * @param {string} id - Product UUID
 * @returns {Object|null} The deleted product row or null
 */
const deleteProduct = async (id) => {
  const query = 'DELETE FROM products WHERE id = $1 RETURNING *';
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

module.exports = {
  getAllProducts,
  getProductById,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
