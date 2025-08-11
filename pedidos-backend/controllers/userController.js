const userService = require('../services/userService');

const userController = {
  /**
   * Obtiene la lista de todos los usuarios.
   * Solo para administradores.
   */
  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  },

  /**
   * Obtiene un usuario por su ID.
   * Solo para administradores.
   */
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.findUserById(id);

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error('Error al obtener usuario por ID:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  },

  /**
   * Actualiza los datos de un usuario.
   * Solo para administradores.
   */
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      console.log('Id:', id);
      console.log('Datos recibidos para actualizar:', updatedData); // <-- AÑADE ESTA LÍNEA
      const updatedUser = await userService.updateUser(id, updatedData);

      if (!updatedUser) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }

      res.status(200).json({
        message: 'Usuario actualizado exitosamente.',
        user: updatedUser
      });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  },

  /**
   * Elimina un usuario.
   * Solo para administradores.
   */
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const result = await userService.deleteUser(id);

      if (result === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }

      //res.status(204).send(); // 204 No Content para eliminaciones exitosas

      return res.status(200).json({ message: 'Usuario eliminado exitosamente.' });
      
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }
};

module.exports = userController;