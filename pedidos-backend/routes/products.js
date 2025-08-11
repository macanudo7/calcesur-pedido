// pedidos-backend/routes/products.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Rutas para la gestión de productos
router.post('/', productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/search', productController.searchProducts); // Ruta para búsqueda

module.exports = router;