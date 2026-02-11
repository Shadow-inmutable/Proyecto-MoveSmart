import mysql from 'mysql2/promise';
import dotenv from 'dotenv';


dotenv.config();

/**
 * Crea un pool de conexiones a MySQL
 * Es más eficiente que una conexión única
 */
export const createMySQLConnection = async () => {
    try {
        const pool = await mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'move_smart_db',
            port: process.env.DB_PORT || 3306,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelayMs: 0,
        });

        console.log('✅ Pool de MySQL creado exitosamente!');
        return pool;
    } catch (error) {
        console.error('❌ Error creando pool MySQL:', error.message);
        throw error;
    }
};

/**
 * Ejecuta una consulta segura
 */
export const executeQuery = async (pool, sql, params = []) => {
    try {
        const [rows] = await pool.execute(sql, params);
        return rows;
    } catch (error) {
        console.error('❌ Error ejecutando query:', error);
        throw error;
    }
};


// Inicializar la conexión
export const initDB = async () => {
    db = await connectDB();
    return db;
};

export { db };
export default db;
