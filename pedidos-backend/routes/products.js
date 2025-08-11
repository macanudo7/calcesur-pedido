// pedidos-backend/routes/products.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Rutas para la gestión de productos
router.post('/', protect, restrictTo('admin'), productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', protect, restrictTo('admin'), productController.updateProduct);
router.delete('/:id', protect, restrictTo('admin'), productController.deleteProduct);
router.get('/search', productController.searchProducts); // Ruta para búsqueda

module.exports = router;