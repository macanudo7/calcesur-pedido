// pedidos-backend/services/productService.js
const { Product, TypeVehicle } = require('../models');
const { Op } = require('sequelize'); // Usaremos Op para búsquedas avanzadas si es necesario

const productService = {

  /**
   * Crea un nuevo producto.
   * @param {object} productData - Datos del producto a crear.
   * @returns {Promise<Product>} El producto creado.
   */
  async createProduct(productData) {
    try {
      const newProduct = await Product.create(productData);
      return newProduct;
    } catch (error) {
      console.error('Error al crear producto en el servicio:', error);
      throw new Error('No se pudo crear el producto.');
    }
  },

  /**
   * Obtiene todos los productos, opcionalmente con su tipo de vehículo asociado.
   * @returns {Promise<Array>} Lista de productos en el formato deseado.
   */
  async getAllProducts() {
    try {
      const products = await Product.findAll({
        include: [
          {
            model: TypeVehicle,
            as: 'typeVehicle', // Usa el alias definido en el modelo Product.js
            attributes: ['type_vehicle_id', 'name'] // Solo incluye el campo 'name' del tipo de vehículo

          }

        ]
      });
      
      return products.map(product => ({
        id: product.product_id,
        code: product.code,
        name: product.name,
        type_unit: product.type_unit,
        type_vehicle: product.typeVehicle
          ? {
              type_vehicle_id: product.typeVehicle.type_vehicle_id,
              name: product.typeVehicle.name
            }
          : null,
        spec_sheet_url: product.spec_sheet_url
      }));
      
    } catch (error) {
      console.error('Error al obtener productos en el servicio:', error);
      throw new Error('No se pudieron obtener los productos.');
    }
  },

  /**
   * Obtiene un producto por su ID.
   * @param {number} productId - ID del producto.
   * @param {boolean} includeTypeVehicle - Si es true, incluye los datos del tipo de vehículo.
   * @returns {Promise<Product>} El producto encontrado o null.
   */
  async getProductById(productId, includeTypeVehicle = false) {
    try {
      const options = {
        where: { product_id: productId },
        include: []
      };
      if (includeTypeVehicle) {
        options.include.push({
          model: TypeVehicle,
          as: 'typeVehicle' // Usa el alias definido en el modelo Product.js
        });
      }
      const product = await Product.findByPk(productId, options);
      return product;
    } catch (error) {
      console.error(`Error al obtener producto con ID ${productId} en el servicio:`, error);
      throw new Error('No se pudo obtener el producto.');
    }
  },

  /**
   * Actualiza un producto existente.
   * @param {number} productId - ID del producto a actualizar.
   * @param {object} updateData - Datos para actualizar el producto.
   * @returns {Promise<[number, Array<Product>]>} Array con el número de filas afectadas y los productos actualizados.
   */
  async updateProduct(productId, updateData) {
    try {
      const [updatedRowsCount, updatedProducts] = await Product.update(updateData, {
        where: { product_id: productId },
        returning: true, // Esto hace que Sequelize devuelva los registros actualizados
      });
      if (updatedRowsCount === 0) {
        return null; // Producto no encontrado o no se actualizó
      }
      return updatedProducts[0]; // Retorna el primer producto actualizado
    } catch (error) {
      console.error(`Error al actualizar producto con ID ${productId} en el servicio:`, error);
      throw new Error('No se pudo actualizar el producto.');
    }
  },

  /**
   * Elimina un producto por su ID.
   * @param {number} productId - ID del producto a eliminar.
   * @returns {Promise<number>} Número de filas eliminadas (1 si se eliminó, 0 si no se encontró).
   */
  async deleteProduct(productId) {
    try {
      const deletedRowCount = await Product.destroy({
        where: { product_id: productId }
      });
      return deletedRowCount;
    } catch (error) {
      console.error(`Error al eliminar producto con ID ${productId} en el servicio:`, error);
      throw new Error('No se pudo eliminar el producto.');
    }
  },

  /**
   * Busca productos por nombre o código.
   * @param {string} searchTerm - Término de búsqueda.
   * @param {boolean} includeTypeVehicle - Si es true, incluye los datos del tipo de vehículo.
   * @returns {Promise<Array<Product>>} Lista de productos que coinciden con el término de búsqueda.
   */
  async searchProducts(searchTerm, includeTypeVehicle = false) {
    try {
      const options = {
        where: {
          [Op.or]: [
            { name: { [Op.iLike]: `%${searchTerm}%` } }, // Búsqueda insensible a mayúsculas/minúsculas por nombre
            { code: parseInt(searchTerm) || null } // Intenta buscar por código si es un número
          ]
        },
        include: []
      };
      if (includeTypeVehicle) {
        options.include.push({
          model: TypeVehicle,
          as: 'typeVehicle'
        });
      }
      const products = await Product.findAll(options);
      return products;
    } catch (error) {
      console.error(`Error al buscar productos con término "${searchTerm}" en el servicio:`, error);
      throw new Error('No se pudieron buscar productos.');
    }
  }
};

module.exports = productService;