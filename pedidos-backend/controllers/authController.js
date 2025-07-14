const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const authController = {
  /**
   * Controlador para el registro de un nuevo usuario.
   * Dependiendo de la lógica, el registro de clientes podría ser solo por admin,
   * o permitir auto-registro inicial. Aquí asumimos un registro general.
   */
  async register(req, res) {
    try {
      const {
        username,
        ruc, // Campo para clientes
        password,
        email,
        name,
        phone,
        userType, // 'client' o 'admin'
        status,
        observations,
        usualProductsNotes,
        ccEmails,
        leadTimeDays
      } = req.body;


      console.log('Extracted password:', password);

      // Validaciones básicas
      if (!username || !password || !email || !name || !userType) {
        return res.status(400).json({
          message: 'Todos los campos obligatorios (username, password, email, name, userType) son requeridos.'
        });
      }

      // **NUEVA VALIDACIÓN:** Contraseña no vacía y longitud mínima
      if (typeof password !== 'string' || password.length < 6) { // Mínimo 6 caracteres, ajusta según tu política
        return res.status(400).json({
          message: 'La contraseña es requerida y debe tener al menos 6 caracteres.'
        });
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          message: 'Formato de correo electrónico inválido.'
        });
      }

      // Validar si el username o email ya existen
      const existingUserByUsername = await userService.findUserByIdentifier(username);
      if (existingUserByUsername) {
        return res.status(409).json({
          message: 'El nombre de usuario ya está en uso.'
        });
      }
      const existingUserByEmail = await userService.findUserByIdentifier(email);
      if (existingUserByEmail) {
        return res.status(409).json({
          message: 'El correo electrónico ya está en uso.'
        });
      }

      // Prepara los datos para el servicio
      const userData = {
        username,
        ruc: userType === 'client' ? ruc : null, // RUC solo para clientes
        password,
        email,
        name,
        phone: phone || null,
        user_type: userType, // Asegúrate de que coincida con el nombre de columna en la DB
        status: status || 'active',
        observations: observations || null,
        usual_products_notes: usualProductsNotes || null,
        cc_emails: ccEmails || null,
        lead_time_days: userType === 'client' ? leadTimeDays : null, // Lead time solo para clientes
      };

      const newUser = await userService.createUser(userData);

      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        user: newUser
      });

    } catch (error) {
      console.error('Error al registrar usuario:', error);
      res.status(500).json({
        message: 'Error interno del servidor al registrar usuario.'
      });
    }
  },

  /**
   * Controlador para el inicio de sesión de usuarios (clientes y administradores).
   */
  async login(req, res) {
    try {
      const {
        identifier, // Puede ser username (RUC+siglas para cliente, o nombre de usuario para admin) o email
        password,
        userType // Para diferenciar el flujo si es necesario (ej. login de admin vs login de cliente)
      } = req.body;

      if (!identifier || !password || !userType) {
        return res.status(400).json({
          message: 'Identificador (username/email), contraseña y tipo de usuario son requeridos.'
        });
      }

      const user = await userService.findUserByIdentifier(identifier);

      if (!user) {
        return res.status(401).json({
          message: 'Credenciales inválidas.'
        });
      }

      // **CAMBIO AQUÍ: ACCEDE A user.userType EN LUGAR DE user.user_type**
      console.log('User Type from DB:', user.userType, '(', user.userType.length, 'chars)');
      console.log('User Type from Request:', userType, '(', userType.length, 'chars)');
      console.log('Comparison Result:', user.userType !== userType);

      // Verificar que el tipo de usuario del login coincida con el de la DB
      if (user.userType.trim().toLowerCase() !== userType.trim().toLowerCase()) { // Usando .trim().toLowerCase() es lo más robusto
        console.log('Type Mismatch Debug: DB:', user.userType, 'Req:', userType);
        return res.status(401).json({
          message: 'Tipo de usuario incorrecto para estas credenciales.'
        });
      }

      // Validar la contraseña
      const isPasswordValid = await userService.validatePassword(password, user.passwordHash);

      if (!isPasswordValid) {
        return res.status(401).json({
          message: 'Credenciales inválidas.'
        });
      }

      // Si el usuario está inactivo
      if (user.status !== 'active') {
        return res.status(403).json({
          message: 'Su cuenta no está activa. Contacte al administrador.'
        });
      }

      // Generar JWT
      const token = jwt.sign({
        user_id: user.user_id,
        user_type: user.userType,
        username: user.username,
        email: user.email
      }, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn
      });

      // Excluir el hash de la contraseña de la respuesta
      const userResponse = user.toJSON();
      delete userResponse.passwordHash;

      res.status(200).json({
        message: 'Inicio de sesión exitoso.',
        token,
        user: userResponse
      });

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).json({
        message: 'Error interno del servidor al iniciar sesión.'
      });
    }
  },

  /**
   * Controlador para la recuperación de contraseña.
   * Esto generalmente implica enviar un correo electrónico con un token de restablecimiento.
   * Para simplificar, aquí solo daremos una idea del flujo.
   */
  async forgotPassword(req, res) {
    try {
      const {
        email
      } = req.body;

      if (!email) {
        return res.status(400).json({
          message: 'El correo electrónico es requerido para recuperar la contraseña.'
        });
      }

      const user = await userService.findUserByIdentifier(email);

      if (!user) {
        // Por seguridad, siempre responde con un mensaje genérico para no revelar si el email existe
        return res.status(200).json({
          message: 'Si su correo está registrado, recibirá un enlace para restablecer su contraseña.'
        });
      }

      // --- Lógica para generar y enviar token de restablecimiento (requiere nodemailer, etc.) ---
      // 1. Generar un token único y con fecha de expiración
      // 2. Guardar el token hasheado y su expiración en la DB en una tabla de `PasswordResetTokens`
      // 3. Enviar un correo electrónico al `user.email` con un enlace que contenga el token.
      // Ejemplo: `http://tudominiofrontend/reset-password?token=XYZ`
      // -----------------------------------------------------------------------------------------

      res.status(200).json({
        message: 'Si su correo está registrado, recibirá un enlace para restablecer su contraseña.'
      });

    } catch (error) {
      console.error('Error en recuperación de contraseña:', error);
      res.status(500).json({
        message: 'Error interno del servidor al recuperar contraseña.'
      });
    }
  },

  // resetPassword (para cuando el usuario hace clic en el enlace del correo) se implementaría aquí también
};

module.exports = authController;