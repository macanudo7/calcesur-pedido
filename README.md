Markdown

# Proyecto CalceSur Pedido

Este repositorio contiene la aplicación CalceSur Pedido, dividida en dos componentes principales: un backend (API RESTful) y un frontend (aplicación web).

## Estructura del Proyecto

calcesur-pedido/
├── pedidos-backend/      # Contiene el código fuente del API RESTful (Node.js/Express)
└── pedidos-frontend/     # Contiene el código fuente de la aplicación web (React/Vue/Frontend Framework)
└── README.md             # Este archivo
└── .gitignore            # Archivo de configuración de Git para ignorar archivos y carpetas


## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu sistema:

* **Node.js**: [Descargar e instalar Node.js](https://nodejs.org/) (se recomienda la versión LTS).
* **npm** (Node Package Manager): Viene incluido con Node.js.
* **Git**: [Descargar e instalar Git](https://git-scm.com/downloads).
* **PostgreSQL**: [Descargar e instalar PostgreSQL](https://www.postgresql.org/download/).
    * Necesitarás un servidor PostgreSQL en ejecución y credenciales de acceso.
    * Herramientas como `pgAdmin` son útiles para gestionar la base de datos.

## Configuración e Instalación

Sigue estos pasos para configurar y ejecutar ambos componentes del proyecto.

### 1. Clonar el Repositorio

Abre tu terminal y clona este repositorio:

```bash
git clone [https://github.com/tu-usuario/calcesur-pedido.git](https://github.com/tu-usuario/calcesur-pedido.git)
cd calcesur-pedido

2. Configuración del Backend (pedidos-backend)

Navega a la carpeta del backend e instala las dependencias:
Bash

cd pedidos-backend
npm install

Variables de Entorno del Backend

Crea un archivo .env en la carpeta pedidos-backend/ (no lo subas a Git). Puedes usar el archivo .env.example como plantilla:
Bash

cp .env.example .env

Edita el archivo .env y configura tus variables de entorno para la base de datos y la clave JWT. Asegúrate de reemplazar los valores de ejemplo con tus propios datos.
Fragmento de código

# Configuración de la Base de Datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_NAME=calcesur_db # O el nombre de tu base de datos

# Clave Secreta para JWT (GENERAR UNA CLAVE LARGA Y SEGURA EN PRODUCCIÓN)
JWT_SECRET=D5FF2DBC5A7BB15956AB866F17E9A # Utiliza una clave fuerte para producción
JWT_EXPIRES_IN=1h

# Puerto del servidor backend
PORT=3000

# Configuración de CORS para el frontend (asegúrate que coincida con el puerto de tu frontend)
CORS_ORIGIN=http://localhost:5173 # Por ejemplo, si tu frontend corre en el puerto 5173

Configuración y Migraciones de la Base de Datos

    Crea una base de datos en PostgreSQL con el nombre que especificaste en DB_NAME (ej. calcesur_db). Puedes usar pgAdmin o la terminal:
    SQL

CREATE DATABASE calcesur_db;

Ejecuta las migraciones de Sequelize para crear las tablas de la base de datos:
Bash

    npx sequelize-cli db:migrate

        Si necesitas deshacer una migración: npx sequelize-cli db:migrate:undo

        Si necesitas deshacer todas las migraciones: npx sequelize-cli db:migrate:undo:all

Iniciar el Servidor Backend

Bash

npm start

El servidor backend debería estar ejecutándose en http://localhost:3000. La API estará disponible en http://localhost:3000/api.

3. Configuración del Frontend (pedidos-frontend)

Abre una nueva terminal (manteniendo el backend en ejecución). Navega a la carpeta del frontend e instala las dependencias:
Bash

cd ../pedidos-frontend # Vuelve a la carpeta raíz del proyecto y luego entra al frontend
npm install

Variables de Entorno del Frontend

Crea un archivo .env en la carpeta pedidos-frontend/ (no lo subas a Git). Puedes usar el archivo .env.example como plantilla:
Bash

cp .env.example .env

Edita el archivo .env para apuntar a tu API backend:
Fragmento de código

VITE_API_BASE_URL=http://localhost:3000/api

Iniciar la Aplicación Frontend

Bash

npm run dev # O 'npm start' o 'npm run serve' dependiendo de tu framework (React: npm run dev, Vue: npm run serve, etc.)

La aplicación frontend debería abrirse en tu navegador, generalmente en http://localhost:5173 o un puerto similar.

Uso de la API

Aquí hay algunos endpoints clave de la API para probar con herramientas como Postman, Insomnia o cURL:

    POST /api/auth/register: Registrar un nuevo usuario.
    JSON

{
    "username": "ejemplo-usuario",
    "ruc": "20123456789",
    "password": "PasswordSegura123",
    "email": "ejemplo@dominio.com",
    "name": "Nombre de Cliente S.A.C.",
    "phone": "998877665",
    "userType": "client",
    "status": "active",
    "observations": "Notas adicionales sobre el cliente",
    "usualProductsNotes": "Productos que suele pedir el cliente",
    "ccEmails": "otroemail@ejemplo.com",
    "leadTimeDays": 5
}

POST /api/auth/login: Iniciar sesión.
JSON

    {
        "identifier": "ejemplo-usuario",
        "password": "PasswordSegura123",
        "userType": "client"
    }

    (Devuelve un JWT si es exitoso).

Asegúrate de ajustar los datos de ejemplo a tus necesidades y a los tipos de usuario que estés utilizando (client, admin, etc.).
