const typeVehicleService = require('../services/typeVehicleService');

const typeVehicleController = {

    async createTypeVehicle(req, res) {
        try{
            const { name, code} = req.body;

            if( !name || !code ){
                return res.status(400).json({message: 'Nombre y código son campos obligatorios.'})
            }

            // Verificar si ya existe un tipo de vehículo con el mismo nombre o código
            const existingTypeVehicle = await typeVehicleService.findTypeVehicleByIdentifier(name) ||
                                        await typeVehicleService.findTypeVehicleByIdentifier(code);

            if (existingTypeVehicle) {
                return res.status(409).json({ message: 'Ya existe un tipo de vehículo con ese nombre o código.' });
            }     
            
            const newTypeVehicle = await typeVehicleService.createTypeVehicle({ name, code});
            res.status(201).json({
                message: 'Tipo de vehículo creado exitosamente.',
                typeVehicle: newTypeVehicle
            });
        }catch (error) {
            console.error('Error al crear tipo de vehículo:', error);
            res.status(500).json({ message: 'Error interno del servidor al crear tipo de vehículo.' });
        }
    },

        /**
     * Obtiene todos los tipos de vehículo.
     */
    async getAllTypeVehicles(req, res) {
        try {
        const typeVehicles = await typeVehicleService.getAllTypeVehicles();
        res.status(200).json(typeVehicles);
        } catch (error) {
        console.error('Error al obtener tipos de vehículo:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener tipos de vehículo.' });
        }
    },

    /**
     * Obtiene un tipo de vehículo por ID.
     */
    async getTypeVehicleById(req, res) {
        try {
        const { id } = req.params; // El ID vendrá de la URL (ej. /type-vehicles/1)
        const typeVehicle = await typeVehicleService.getTypeVehicleById(id);

        if (!typeVehicle) {
            return res.status(404).json({ message: 'Tipo de vehículo no encontrado.' });
        }
        res.status(200).json(typeVehicle);
        } catch (error) {
        console.error('Error al obtener tipo de vehículo por ID:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener tipo de vehículo.' });
        }
    },

    /**
     * Actualiza un tipo de vehículo.
     */
    async updateTypeVehicle(req, res) {
        try {
        const { id } = req.params;
        const { name, code } = req.body;

        if (!name && !code) {
            return res.status(400).json({ message: 'Debe proporcionar al menos un campo (nombre o código) para actualizar.' });
        }

        const [updatedRows] = await typeVehicleService.updateTypeVehicle(id, { name, code });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Tipo de vehículo no encontrado o no se realizaron cambios.' });
        }
        res.status(200).json({ message: 'Tipo de vehículo actualizado exitosamente.' });
        } catch (error) {
        console.error('Error al actualizar tipo de vehículo:', error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar tipo de vehículo.' });
        }
    },

    /**
     * Elimina un tipo de vehículo.
     */
    async deleteTypeVehicle(req, res) {
        try {
        const { id } = req.params;
        const deletedRows = await typeVehicleService.deleteTypeVehicle(id);

        if (deletedRows === 0) {
            return res.status(404).json({ message: 'Tipo de vehículo no encontrado.' });
        }
        res.status(200).json({ message: 'Tipo de vehículo eliminado exitosamente.' });
        } catch (error) {
        console.error('Error al eliminar tipo de vehículo:', error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar tipo de vehículo.' });
        }
    }
};

module.exports = typeVehicleController;

