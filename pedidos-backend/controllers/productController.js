// pedidos-backend/controllers/productController.js
const productService = require('../services/productService');

const productController = {

  /**
   * POST /api/products
   * Crea un nuevo producto.
   */
  async createProduct(req, res) {
    try {
      const { name, code, type_vehicle_id, type_unit } = req.body;

      // Validación básica
      if (!name || !code || !type_vehicle_id) {
        return res.status(400).json({ message: 'Nombre, código y tipo de vehículo son requeridos.' });
      }

      const product = await productService.createProduct({
        name,
        code,
        type_vehicle_id,
        type_unit,
        spec_sheet_url 
      });
      res.status(201).json(product);
    } catch (error) {
      console.error('Error en productController.createProduct:', error.message);
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * GET /api/products
   * Obtiene todos los productos.
   * Query param: ?includeTypeVehicle=true para incluir el tipo de vehículo.
   */
  async getAllProducts(req, res) {
    try {
      const includeTypeVehicle = req.query.includeTypeVehicle === 'true';
      const products = await productService.getAllProducts(includeTypeVehicle);
      res.status(200).json(products);
    } catch (error) {
      console.error('Error en productController.getAllProducts:', error.message);
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * GET /api/products/:id
   * Obtiene un producto por su ID.
   * Query param: ?includeTypeVehicle=true para incluir el tipo de vehículo.
   */
  async getProductById(req, res) {
    try {
      const productId = req.params.id;
      const includeTypeVehicle = req.query.includeTypeVehicle === 'true';
      const product = await productService.getProductById(productId, includeTypeVehicle);

      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado.' });
      }
      res.status(200).json(product);
    } catch (error) {
      console.error('Error en productController.getProductById:', error.message);
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * PUT /api/products/:id
   * Actualiza un producto existente.
   */
  async updateProduct(req, res) {
    try {
      const productId = req.params.id;
      const updateData = req.body;

      // Opcional: Validación adicional de los datos de actualización
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: 'No se proporcionaron datos para actualizar.' });
      }

      const updatedProduct = await productService.updateProduct(productId, updateData);

      if (!updatedProduct) {
        return res.status(404).json({ message: 'Producto no encontrado o no se pudo actualizar.' });
      }
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error('Error en productController.updateProduct:', error.message);
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * DELETE /api/products/:id
   * Elimina un producto.
   */
  async deleteProduct(req, res) {
    try {
      const productId = req.params.id;
      const deletedCount = await productService.deleteProduct(productId);

      if (deletedCount === 0) {
        return res.status(404).json({ message: 'Producto no encontrado.' });
      }
      res.status(204).send(); // 204 No Content para eliminación exitosa
    } catch (error) {
      console.error('Error en productController.deleteProduct:', error.message);
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * GET /api/products/search
   * Busca productos por nombre o código.
   * Query param: ?q=searchTerm
   * Query param: ?includeTypeVehicle=true
   */
  async searchProducts(req, res) {
    try {
      const searchTerm = req.query.q;
      const includeTypeVehicle = req.query.includeTypeVehicle === 'true';

      if (!searchTerm) {
        return res.status(400).json({ message: 'El parámetro de búsqueda "q" es requerido.' });
      }

      const products = await productService.searchProducts(searchTerm, includeTypeVehicle);
      res.status(200).json(products);
    } catch (error) {
      console.error('Error en productController.searchProducts:', error.message);
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = productController;