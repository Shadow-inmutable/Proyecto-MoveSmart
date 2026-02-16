import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 🔧 Importaciones de configuración (Ajustadas a tu carpeta config)
import { initDB } from './config/db.js'; 
import { attachDB } from './middlewares/attachDB.js';

// ⚙️ Configuración inicial
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_manizales';

// 🔧 Middlewares globales
app.use(cors());
app.use(express.json());

// 📊 Variable global para la conexión
let db;

/**
 * 🔐 Middleware de protección JWT (Punto 7 y 8)
 */
const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ success: false, error: 'Token requerido' });

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(401).json({ success: false, error: 'Token inválido' });
    }
};

/**
 * 🚀 Inicio del Servidor y Lógica del Proyecto
 */
const startServer = async () => {
    try {
        db = await initDB();
        app.use(attachDB(db));
        console.log('✅ Conexión a move_smart_db exitosa');

        // ================= USUARIOS (Punto 7: Autenticación) =================

        app.post('/api/usuarios/registro', async (req, res) => {
            try {
                const { nombre, email, password, rol } = req.body;
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                await req.db.query(
                    'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
                    [nombre, email, hashedPassword, rol || 'ciudadano']
                );
                res.status(201).json({ success: true, message: 'Usuario registrado' });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        app.post('/api/usuarios/login', async (req, res) => {
            const { email, password } = req.body;
            const [users] = await req.db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

            if (users.length === 0 || !(await bcrypt.compare(password, users[0].password))) {
                return res.status(401).json({ success: false, error: 'Credenciales incorrectas' });
            }

            const token = jwt.sign({ id: users[0].id, rol: users[0].rol }, JWT_SECRET, { expiresIn: '4h' });
            res.json({ success: true, token, user: { nombre: users[0].nombre, rol: users[0].rol } });
        });

        // ================= RUTAS Y ANÁLISIS (Punto 9 y 11) =================

        // GET: Visualizar rutas (Público - Ciudadano)
        app.get('/api/rutas', async (req, res) => {
            const [routes] = await req.db.query('SELECT * FROM rutas');
            res.json({ success: true, data: routes });
        });

        // POST: Crear ruta y análisis simulado (Solo GESTOR)
        app.post('/api/rutas', verificarToken, async (req, res) => {
            if (req.user.rol !== 'gestor') return res.status(403).json({ error: 'Acceso denegado' });

            const { nombre, tipo, color_hex, distancia_km } = req.body;
            
            // Lógica simulada (Punto 11): Calculamos tiempo y eficiencia automáticamente
            const tiempo_estimado = Math.round(distancia_km * 3.5); // Simulación: 3.5 min por km
            const eficiencia = Math.floor(Math.random() * (95 - 70 + 1)) + 70; // Simulación: 70% a 95%

            try {
                const [result] = await req.db.query(
                    'INSERT INTO rutas (nombre, tipo, color_hex, distancia_km, tiempo_estimado_min, eficiencia_porcentaje) VALUES (?, ?, ?, ?, ?, ?)',
                    [nombre, tipo || 'actual', color_hex || '#3498db', distancia_km, tiempo_estimado, eficiencia]
                );
                res.status(201).json({ success: true, data: { id: result.insertId, tiempo_estimado, eficiencia } });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // ================= ZONAS CRÍTICAS (Punto 2 y 3) =================

        app.get('/api/zonas', async (req, res) => {
            const [zonas] = await req.db.query('SELECT * FROM zonas_criticas');
            res.json({ success: true, data: zonas });
        });

        app.post('/api/zonas', verificarToken, async (req, res) => {
            if (req.user.rol !== 'gestor') return res.status(403).json({ error: 'No autorizado' });
            const { nombre, nivel_congestion, latitud, longitud } = req.body;
            await req.db.query(
                'INSERT INTO zonas_criticas (nombre, nivel_congestion, latitud, longitud) VALUES (?, ?, ?, ?)',
                [nombre, nivel_congestion, latitud, longitud]
            );
            res.json({ success: true, message: 'Zona crítica registrada' });
        });

        // ================= LANZAMIENTO =================
        app.listen(PORT, () => {
            console.log(`🚀 Move Smart Manizales: http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('❌ Error de inicio:', error);
    }
};

startServer();