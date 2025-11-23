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

### 1. Clonar el repositorio e instalar dependencias

El proyecto utiliza una arquitectura monolítica (Frontend servido por Backend), por lo que solo necesitas instalar dependencias en la raíz.

```bash
git clone [https://github.com/tu-usuario/CANINU.git](https://github.com/tu-usuario/CANINU.git)
cd CANINU
npm install
```
## Autores
Nahomy Llumiquinga -  https://github.com/Naho-10C  

Javier Angulo - https://github.com/MRGonorrea79

Andreina Pallo - https://github.com/Andreina-P
