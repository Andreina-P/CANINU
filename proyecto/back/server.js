import express from "express";
import session from "express-session";
import cors from "cors";
import bodyParser from "body-parser";
import pkg from "pg";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pkg;
const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(bodyParser.json());

app.use(
  session({
    secret: "Serena",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60
    }
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));

const pool = new Pool({
  user: "admin",
  host: "localhost",
  database: "postgres",
  password: "admin123",
  port: 5432
});


app.post("/register", async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password)
    return res.json({ success: false, message: "Todos los campos son obligatorios" });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return res.json({ success: false, message: "Email inválido" });

  if (password.length < 3)
    return res.json({ success: false, message: "La contraseña debe tener al menos 3 caracteres" });

  try {
    const check = await pool.query(
      `SELECT email FROM public."usuarios" WHERE email = $1`,
      [email]
    );

    if (check.rowCount > 0) {
      return res.json({ success: false, message: "El email ya está registrado" });
    }

    await pool.query(
      `INSERT INTO public."usuarios" (username, email, password, rol)
       VALUES ($1, $2, $3, 'usuario')`,
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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return res.json({ success: false, message: "Email inválido" });

  if (typeof password !== "string" || password.length < 3)
    return res.json({ success: false, message: "Contraseña inválida" });

  try {
    const result = await pool.query(
      'SELECT * FROM public."usuarios" WHERE email = $1',
      [email]
    );

    if (result.rowCount === 0) {
      return res.json({ success: false, message: "Usuario no encontrado" });
    }

    const user = result.rows[0];

    if (password !== user.password) {
      return res.json({ success: false, message: "Contraseña incorrecta" });
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      rol: user.rol
    };

    let dashboard = "";

    switch (user.rol) {
      case "admin":
        dashboard = "/dashboard_Admin.html";
        break;
      case "empleado":
        dashboard = "/dashboard_Empleados.html";
        break;
      default:
        dashboard = "/dashboard.html";
        break;
    }

    return res.json({
      success: true,
      username: user.username,
      rol: user.rol,
      dashboard
    });

  } catch (error) {
    console.error("Error al validar usuario:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

app.get("/session-info", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ logged: false });
  }
  res.json({ logged: true, user: req.session.user });
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.listen(3000, () => {
  console.log("Servidor backend en http://localhost:3000");
});
