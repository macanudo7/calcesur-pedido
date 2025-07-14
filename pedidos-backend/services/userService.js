const { User, Sequelize } = require('../models'); // <-- Añade Sequelize aquí
const bcrypt = require('bcryptjs');

const userService = {
  /**
   * Crea un nuevo usuario en la base de datos.
   * @param {object} userData - Datos del usuario a crear.
   * @returns {Promise<User>} El objeto User creado.
   */
  async createUser(userData) {
    const { password, ...otherData } = userData;

    console.log('Password in userService before hash:', password); // <-- AÑADE ESTA LÍNEA

    // Hashear la contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(password, 10); // 10 es el costo del hash

    console.log('Hashed Password:', hashedPassword); // <-- AÑADE ESTA LÍNEA

    // Crear el usuario en la DB
    const user = await User.create({
      ...otherData,
      passwordHash: hashedPassword, // Asegúrate de que coincida con el nombre de columna en la DB
      // Establecer user_type por defecto si no viene en userData, o según tu lógica de registro
      user_type: otherData.user_type || 'client',
      status: otherData.status || 'active',
      // No pasar ruc si es un admin, y viceversa si es un cliente
      ruc: otherData.ruc || null,
      cc_emails: otherData.cc_emails || null,
      lead_time_days: otherData.lead_time_days || null,
      usual_products_notes: otherData.usual_products_notes || null,
      observations: otherData.observations || null,
      // created_at y updated_at se manejan automáticamente por Sequelize
    });

    // Excluir el hash de la contraseña de la respuesta
    const userResponse = user.toJSON();
    delete userResponse.password_hash;
    return userResponse;
  },

  /**
   * Busca un usuario por username o email.
   * @param {string} identifier - username o email del usuario.
   * @returns {Promise<User|null>} El objeto User encontrado o null si no existe.
   */
  async findUserByIdentifier(identifier) {
    const user = await User.findOne({
      where: {
        [Sequelize.Op.or]: [
          { username: identifier },
          { email: identifier }
        ]
      }
    });
    return user;
  },

  /**
   * Valida la contraseña de un usuario.
   * @param {string} plainPassword - Contraseña en texto plano.
   * @param {string} hashedPassword - Contraseña hasheada de la DB.
   * @returns {Promise<boolean>} True si las contraseñas coinciden, false en caso contrario.
   */
  async validatePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
};

module.exports = userService;