import express from 'express';
import cors from 'cors';
import bodyparser from 'body-parser';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


// 🔧 Implementacion y uso de Middlewares para:
import { initDB } from './db.js'; // Middleware para inicializar y conectar a la base de datos
import { attachDB } from './middlewares/attachDB.js'; // Middleware para inyectar la conexión de BD en cada request
import { dbErrorHandler } from './middlewares/dbErrorHandler.js'; // Middleware para manejar errores de base de datos

// ⚙️ Configuración inicial
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

// 🔧 Middlewares globales
app.use(cors());
app.use(express.json());
app.use(bodyparser.json());

// 📊 Variable global para la conexión
let db;

/**
 * 🔐 Middleware de protección JWT
 * (NO rompe la arquitectura existente)
 */
const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(403).json({
            success: false,
            error: 'Token requerido'
        });
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { id, rol }
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: 'Token inválido o expirado'
        });
    }
};

/**
 * 🚀 Inicializar servidor y BD
 */
const startServer = async () => {
    try {
        // 🔌 Inicializar conexión a BD
        db = await initDB();
        console.log('✅ Base de datos inicializada correctamente');

        // 💉 Inyectar conexión en requests
        app.use(attachDB(db));

        // ✖️ Middleware de errores
        app.use(dbErrorHandler);

        // ================= HEALTH =================

        app.get('/api/health', async (req, res) => {
            try {
                const [rows] = await req.db.query('SELECT 1 as status');
                res.json({
                    status: 'ok',
                    db: rows[0]?.status === 1 ? 'connected' : 'disconnected',
                    timestamp: new Date().toISOString(),
                    environment: process.env.NODE_ENV
                });
            } catch (error) {
                res.status(500).json({
                    status: 'error',
                    message: 'Database connection failed',
                    error: error.message
                });
            }
        });

        // ================= ROOT =================

        app.get('/', (req, res) => {
            res.json({
                message: '🚌 Bienvenido a Move Smart API',
                version: '1.0.0',
                description: 'Sistema de análisis y optimización de rutas de transporte público'
            });
        });

        // ================= USUARIOS =================

        /**
         * Registro de usuarios
         */
        app.post('/api/usuarios/registro', async (req, res) => {
            try {
                const { nombre, email, password, rol } = req.body;

                if (!nombre || !email || !password) {
                    return res.status(400).json({
                        success: false,
                        error: 'Nombre, email y password son obligatorios'
                    });
                }

                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                await req.db.query(
                    'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
                    [nombre, email, hashedPassword, rol || 'ciudadano']
                );

                res.status(201).json({
                    success: true,
                    message: 'Usuario creado correctamente'
                });

            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Error registrando usuario',
                    message: error.message
                });
            }
        });

        /**
         * Login de usuarios
         */
        app.post('/api/usuarios/login', async (req, res) => {
            try {
                const { email, password } = req.body;

                const [users] = await req.db.query(
                    'SELECT * FROM usuarios WHERE email = ?',
                    [email]
                );

                if (!users || users.length === 0) {
                    return res.status(404).json({
                        success: false,
                        error: 'Usuario no encontrado'
                    });
                }

                const usuario = users[0];
                const passwordOk = await bcrypt.compare(password, usuario.password);

                if (!passwordOk) {
                    return res.status(401).json({
                        success: false,
                        error: 'Contraseña incorrecta'
                    });
                }

                const token = jwt.sign(
                    { id: usuario.id, rol: usuario.rol },
                    JWT_SECRET,
                    { expiresIn: process.env.JWT_EXPIRES_IN || '4h' }
                );

                res.json({
                    success: true,
                    token,
                    user: {
                        id: usuario.id,
                        nombre: usuario.nombre,
                        rol: usuario.rol
                    }
                });

            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Error en login',
                    message: error.message
                });
            }
        });

        // ================= RUTAS =================

        /**
         * Obtener todas las rutas (pública)
         */
        app.get('/api/routes', async (req, res) => {
            try {
                const [routes] = await req.db.query('SELECT * FROM rutas');
                res.json({
                    success: true,
                    count: routes.length,
                    data: routes
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Error obteniendo rutas',
                    message: error.message
                });
            }
        });

        /**
         * Crear ruta (solo GESTOR)
         */
        app.post('/api/routes', verificarToken, async (req, res) => {

            if (req.user.rol !== 'gestor') {
                return res.status(403).json({
                    success: false,
                    error: 'Solo el gestor puede crear rutas'
                });
            }

            try {
                const { nombre, origin, destino, distancia_km, tiempo_estimado_min } = req.body;

                if (!nombre || !origin || !destino) {
                    return res.status(400).json({
                        success: false,
                        error: 'Faltan campos requeridos'
                    });
                }

                const [result] = await req.db.query(
                    'INSERT INTO rutas (nombre, origen, destino, distancia_km, tiempo_estimado_min) VALUES (?, ?, ?, ?, ?)',
                    [nombre, origin, destino, distancia_km || null, tiempo_estimado_min || null]
                );

                res.status(201).json({
                    success: true,
                    message: 'Ruta creada exitosamente',
                    data: { id: result.insertId }
                });

            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Error creando ruta',
                    message: error.message
                });
            }
        });

        // ================= 404 =================

        app.use((req, res) => {
            res.status(404).json({
                success: false,
                error: 'Ruta no encontrada',
                path: req.originalUrl
            });
        });

        // ================= START =================

        app.listen(PORT, () => {
            console.log('\n' + '='.repeat(60));
            console.log('🚀 SERVIDOR INICIADO CORRECTAMENTE');
            console.log(`📍 URL: http://localhost:${PORT}`);
            console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
            console.log(`🔐 JWT activo`);
            console.log('='.repeat(60) + '\n');
        });

    } catch (error) {
        console.error('\n❌ ERROR INICIANDO SERVIDOR:', error);
        process.exit(1);
    }
};

// ▶️ Iniciar servidor
startServer();
