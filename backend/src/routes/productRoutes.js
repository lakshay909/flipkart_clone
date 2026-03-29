const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// ─── PRODUCT ROUTES ──────────────────────────────────────────────────────────
// Route → Controller → Service → Model (DAO)

// GET /api/products          — Get all products (optional ?search=&category=)
router.get('/', productController.getProducts);

// GET /api/products/:id      — Get single product by ID
router.get('/:id', productController.getSingleProduct);

module.exports = router;
