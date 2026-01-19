# 🐶 CANINU — Sistema de Gestión Veterinaria

**CANINU** es una plataforma web integral diseñada para optimizar la gestión de una clínica veterinaria. Permite conectar a los dueños de mascotas con los servicios veterinarios, facilitando el agendamiento de citas, el registro de historial de mascotas y la administración del personal médico y estético.

## Tecnologías utilizadas

| Área | Herramienta | Descripción |
| :--- | :--- | :--- |
| **Frontend** | HTML5 + CSS3 + JS | Interfaz de usuario responsiva e interactiva |
| **Backend** | Node.js + Express | Servidor REST para manejar rutas, sesiones y lógica de negocio |
| **Base de datos** | PostgreSQL | Base de datos relacional para usuarios, mascotas y citas |
| **Conexión BD** | pg (node-postgres) | Cliente para la comunicación entre Node.js y PostgreSQL |
| **Calendario** | FullCalendar | Visualización interactiva de citas para empleados |
| **Configuración** | Dotenv | Manejo seguro de variables de entorno |

## Estructura del Proyecto

El proyecto sigue una arquitectura MVC (Modelo-Vista-Controlador) adaptada:

```text
CANINU/
├── .env                # Variables de entorno (No incluido en repo)
├── server.js           # Punto de entrada del servidor
├── package.json        # Dependencias y scripts
├── config/             # Configuración de base de datos
│   └── db.js
├── back/               # Lógica del Backend
│   ├── controllers/    # Lógica de las funciones
│   └── routes/         # Definición de rutas API
└── front/              # Recursos del Frontend
    ├── assets/         # Imágenes, CSS, JS del cliente
    └── views/          # Archivos HTML
```

## Configuración e Instalación

Sigue estos pasos para correr el proyecto en tu máquina local.

### 1. Requisitos Previos

Asegúrate de tener instalado:

- Node.js (v18 o superior)

- PostgreSQL (Instalado localmente en tu sistema operativo)

- Git

### 2. Clonar el repositorio e instalar dependencias

```bash
git clone https://github.com/Andreina-P/CANINU.git
cd CANINU
npm install
```

### 3. Configurar la Base de Datos

El proyecto requiere una base de datos local. Sigue estos pasos:

1. Abre pgAdmin (o tu terminal de SQL).

2. Crea una base de datos llamada caninu_db.

3. Abre la herramienta de consultas (Query Tool) sobre esa base de datos.

4. Copia el contenido del archivo database.sql (incluido en este repositorio) y ejecútalo. Esto creará todas las tablas necesarias.

### 4. Configurar Variables de Entorno

Abre el nuevo archivo `.env` y edita la línea `DB_PASSWORD` con tu propia contraseña de PostgreSQL.

### 5. Ejecutar el Proyecto

Para iniciar el servidor en modo desarrollo (con recarga automática):

```bash
npm run dev
```
Abre tu navegador en: http://localhost:3000

## Autores
Nahomy Llumiquinga -  https://github.com/Naho-10C  

Javier Angulo - https://github.com/MRGonorrea79

Andreina Pallo - https://github.com/Andreina-P
