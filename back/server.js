import dotenv from 'dotenv';
import express from "express";
import session from "express-session";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

import { pool } from './config/db.js'; 

import citasRouter from './routes/citas.routes.js';
import mascotasRouter from './routes/mascotas.routes.js';

dotenv.config();

const app = express();

// --- CONFIGURACIÓN ---
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "Serena", 
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, 
      maxAge: 1000 * 60 * 60 * 24 // 24 horas
    }
  })
);

// Configuración de archivos estáticos (Frontend)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootPath = path.join(__dirname, "../");
app.use(express.static(rootPath));


// --- RUTAS DE AUTENTICACIÓN (LOGIN / REGISTER) ---

app.post("/register", async (req, res) => {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password)
        return res.json({ success: false, message: "Todos los campos son obligatorios" });
    
    // Validación básica de email y password
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.json({ success: false, message: "Email inválido" });
    if (password.length < 3) return res.json({ success: false, message: "La contraseña debe tener al menos 3 caracteres" });

    try {
        // Verificar si existe el email
        const check = await pool.query(`SELECT email FROM usuarios WHERE email = $1`, [email]);
        if (check.rowCount > 0) {
            return res.json({ success: false, message: "El email ya está registrado" });
        }

        // Crear usuario
        await pool.query(
            `INSERT INTO usuarios (username, email, password, rol) VALUES ($1, $2, $3, 'usuario')`,
            [nombre, email, password]
        );

        res.json({ success: true, message: "Usuario registrado correctamente" });

    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.json({ success: false, message: "Credenciales inválidas" });

    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

        if (result.rowCount === 0) return res.json({ success: false, message: "Usuario no encontrado" });

        const user = result.rows[0];

        if (password !== user.password) {
            return res.json({ success: false, message: "Contraseña incorrecta" });
        }

        // Guardar sesión
        req.session.user = {
            id: user.id,
            username: user.username,
            rol: user.rol
        };

        // Definir redirección según rol
        let dashboard = "/dashboard.html";
        if (user.rol === "admin") dashboard = "/dashboard_Admin.html";
        else if (user.rol === "empleado") dashboard = "/dashboard_Empleados.html";

        return res.json({ success: true, username: user.username, rol: user.rol, dashboard });

    } catch (error) {
        console.error("Error al validar usuario:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});

app.get("/session-info", (req, res) => {
    if (!req.session.user) return res.status(401).json({ logged: false });
    res.json({ logged: true, user: req.session.user });
});

app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.json({ success: true });
    });
});


// Todas las rutas que empiecen con /api/citas van al router de citas
app.use('/api/citas', citasRouter); 

// Todas las rutas que empiecen con /api/mascotas van al router de mascotas
app.use('/api/mascotas', mascotasRouter);


// --- RUTA RAÍZ ---
app.get("/", (req, res) => {
    res.sendFile(path.join(rootPath, "login.html"));
});

// --- LEVANTAR SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor backend en http://localhost:${PORT}`);
});