require('dotenv').config(); // Asegúrate de que dotenv esté cargado al inicio

module.exports = {

  development: {
    username: process.env.DB_USER || 'postgres', // Usa variable de entorno, con fallback
    password: process.env.DB_PASSWORD || 'postgress', // Usa variable de entorno, con fallback
    database: process.env.DB_NAME || 'calcesur_pedido_db', // Usa variable de entorno, con fallback
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres', // El dialecto explícito que Sequelize CLI necesita
    logging: false // Puedes poner true para ver las queries en desarrollo
  },
  test: {
    username: process.env.DB_USER_TEST || 'root',
    password: process.env.DB_PASSWORD_TEST || null,
    database: process.env.DB_NAME_TEST || 'calcesur_test_db',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  },
  production: {
    username: process.env.DB_USER_PROD || 'root',
    password: process.env.DB_PASSWORD_PROD || null,
    database: process.env.DB_NAME_PROD || 'calcesur_production_db',
    host: process.env.DB_HOST_PROD || 'localhost',
    port: process.env.DB_PORT_PROD || 5432,
    dialect: 'postgres',
    logging: false
  },
  
  // ... otras configuraciones de DB si las tienes aquí
  jwtSecret: process.env.JWT_SECRET || 'fallbackSecretForDev',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173' // Añadir CORS aquí si lo usas
};