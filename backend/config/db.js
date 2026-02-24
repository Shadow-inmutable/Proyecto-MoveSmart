import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Cargar las variables del archivo .env
dotenv.config();

/**
 * Configuración y creación del Pool de conexiones.
 * Un pool permite manejar múltiples peticiones simultáneas de forma eficiente.
 */
export const createMySQLConnection = async () => {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelayMs: 0,
        });

        // Verificamos la conexión con un ping inicial
        await pool.query('SELECT 1');
        
        console.log(`✅ Conexión exitosa a MySQL: ${process.env.DB_NAME}`);
        return pool;
    } catch (error) {
        console.error('❌ Error fatal al conectar con MySQL:', error.message);
        // Es mejor lanzar el error para que el servidor no arranque si la DB no sirve
        throw error;
    }
};

/**
 * Inicializador de la base de datos para el index.js
 */
export const initDB = async () => {
    return await createMySQLConnection();
};