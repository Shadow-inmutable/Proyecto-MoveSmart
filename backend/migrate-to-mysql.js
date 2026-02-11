#!/usr/bin/env node

/**
 * SCRIPT DE MIGRACIÓN: db.json → MySQL
 * 
 * Uso: node migrate-to-mysql.js
 * 
 * Este script:
 * 1. Lee datos de db.json
 * 2. Crea backup automático
 * 3. Conecta a MySQL
 * 4. Migra datos de rutas, vehículos y paradas
 * 5. Verifica la migración
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configuración de rutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbJsonPath = path.join(__dirname, 'db.json');
const backupDir = path.join(__dirname, 'backups');

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.cyan}${"=".repeat(60)}${colors.reset}\n${colors.cyan}${msg}${colors.reset}\n${colors.cyan}${"=".repeat(60)}${colors.reset}\n`)
};

/**
 * Crear directorio de backups si no existe
 */
function ensureBackupDir() {
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
    log.info(`Directorio de backups creado: ${backupDir}`);
  }
}

/**
 * Crear backup de db.json
 */
function createBackup() {
  try {
    const dbData = fs.readFileSync(dbJsonPath, 'utf8');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('Z')[0];
    const backupPath = path.join(backupDir, `db-backup-${timestamp}.json`);
    
    fs.writeFileSync(backupPath, dbData, 'utf8');
    log.success(`Backup creado: ${backupPath}`);
    return backupPath;
  } catch (error) {
    log.error(`Error al crear backup: ${error.message}`);
    throw error;
  }
}

/**
 * Leer datos de db.json
 */
function readDbJson() {
  try {
    const data = fs.readFileSync(dbJsonPath, 'utf8');
    const parsed = JSON.parse(data);
    log.success(`db.json leído correctamente`);
    return parsed;
  } catch (error) {
    log.error(`Error al leer db.json: ${error.message}`);
    throw error;
  }
}

/**
 * Conectar a MySQL
 */
async function connectToMySQL() {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'move_smart_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test connection
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    
    log.success(`Conectado a MySQL: ${process.env.DB_NAME}`);
    return pool;
  } catch (error) {
    log.error(`Error de conexión a MySQL: ${error.message}`);
    log.info(`Verifica que XAMPP MySQL está corriendo y que .env está configurado correctamente`);
    throw error;
  }
}

/**
 * Migrar rutas
 */
async function migrateRoutes(pool, routes) {
  try {
    log.info(`Migrando ${routes.length} rutas...`);
    
    let successCount = 0;
    for (const route of routes) {
      try {
        const query = `
          INSERT INTO rutas (id, nombre, codigo, origen, destino, distancia_km, tiempo_estimado_min, paradas_totales, activa)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
          nombre = VALUES(nombre),
          codigo = VALUES(codigo),
          origen = VALUES(origen),
          destino = VALUES(destino),
          distancia_km = VALUES(distancia_km),
          tiempo_estimado_min = VALUES(tiempo_estimado_min),
          paradas_totales = VALUES(paradas_totales),
          activa = VALUES(activa)
        `;
        
        // Manejar tanto estructura en español como en inglés
        const nombre = route.nombre || route.name || `Ruta ${route.id}`;
        const codigo = route.codigo || `R${String(route.id).padStart(3, '0')}`;
        const origen = route.origen || route.origin || '';
        const destino = route.destino || route.destination || '';
        const distancia = route.distancia_km || route.distance_km;
        const tiempo = route.tiempo_estimado_min || route.estimated_time_minutes;
        const paradas = route.paradas_totales || route.stops_count || (route.paradas?.length || 0);
        
        const values = [
          route.id,
          nombre,
          codigo,
          origen,
          destino,
          distancia || null,
          tiempo || null,
          paradas || 0,
          true
        ];

        await pool.execute(query, values);
        successCount++;
      } catch (error) {
        log.warning(`Error migrando ruta ${route.id}: ${error.message}`);
      }
    }
    
    log.success(`${successCount}/${routes.length} rutas migradas`);
    return successCount;
  } catch (error) {
    log.error(`Error en migración de rutas: ${error.message}`);
    throw error;
  }
}

/**
 * Migrar vehículos
 */
async function migrateVehicles(pool, vehicles) {
  try {
    log.info(`Migrando ${vehicles.length} vehículos...`);
    
    let successCount = 0;
    for (const vehicle of vehicles) {
      try {
        const query = `
          INSERT INTO vehiculos (id, ruta_id, placa, modelo, capacidad_asientos, capacidad_parados, consumo_combustible_km, año_fabricacion, estado, activo)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
          ruta_id = VALUES(ruta_id),
          placa = VALUES(placa),
          modelo = VALUES(modelo),
          capacidad_asientos = VALUES(capacidad_asientos),
          capacidad_parados = VALUES(capacidad_parados),
          consumo_combustible_km = VALUES(consumo_combustible_km),
          año_fabricacion = VALUES(año_fabricacion),
          estado = VALUES(estado),
          activo = VALUES(activo)
        `;
        
        // Manejar tanto estructura en español como en inglés
        const placa = vehicle.placa || vehicle.plate;
        const modelo = vehicle.modelo || vehicle.model || 'No especificado';
        const capacidadAsientos = vehicle.capacidad_asientos || vehicle.capacity || 45;
        const capacidadParados = vehicle.capacidad_parados || Math.floor(capacidadAsientos * 0.4) || 20;
        
        // Convertir fuel consumption: lpm (litros por minuto a km - aproximación)
        let consumoCombustible = vehicle.consumo_combustible_km;
        if (!consumoCombustible && vehicle.fuel_consumption_lpm) {
          // Aproximación: si es lpm, convertir a km/l asumiendo 30 km/h promedio
          consumoCombustible = (vehicle.fuel_consumption_lpm * 1000) / capacidadAsientos || 5.5;
        }
        
        const año = vehicle.año_fabricacion || vehicle.year || new Date().getFullYear();
        const estado = vehicle.estado || vehicle.status || 'disponible';
        
        const values = [
          vehicle.id,
          vehicle.ruta_id || vehicle.route_id || null,
          placa,
          modelo,
          capacidadAsientos,
          capacidadParados,
          consumoCombustible || 5.5,
          año,
          estado === 'active' ? 'disponible' : (estado || 'disponible'),
          true
        ];

        await pool.execute(query, values);
        successCount++;
      } catch (error) {
        log.warning(`Error migrando vehículo ${vehicle.id}: ${error.message}`);
      }
    }
    
    log.success(`${successCount}/${vehicles.length} vehículos migrados`);
    return successCount;
  } catch (error) {
    log.error(`Error en migración de vehículos: ${error.message}`);
    throw error;
  }
}

/**
 * Migrar paradas
 */
async function migrateStops(pool, stops, routes) {
  try {
    log.info(`Migrando ${stops.length} paradas...`);
    
    // Limpiar tabla de paradas antes de migrar
    try {
      await pool.execute('TRUNCATE TABLE paradas');
      log.info('Tabla paradas limpiada');
    } catch (error) {
      log.warning(`Advertencia al limpiar paradas: ${error.message}`);
    }
    
    let successCount = 0;
    
    // Primero: agrupar paradas por ruta y contar cuántas paradas hay en cada ruta
    const paradasPorRuta = {};
    stops.forEach((stop) => {
      const routeIds = stop.route_ids || stop.ruta_ids || [];
      routeIds.forEach((routeId) => {
        if (!paradasPorRuta[routeId]) {
          paradasPorRuta[routeId] = [];
        }
        paradasPorRuta[routeId].push(stop);
      });
    });
    
    // Segundo: insertar las paradas con el orden correcto dentro de cada ruta
    for (const stop of stops) {
      try {
        const routeIds = stop.route_ids || stop.ruta_ids || [];
        
        // Para cada ruta a la que pertenece la parada
        for (const routeId of routeIds) {
          try {
            // Calcular el orden: posición en la lista de paradas de esa ruta
            const paradasEnRuta = paradasPorRuta[routeId];
            const orden = paradasEnRuta.findIndex(p => p.id === stop.id) + 1;
            
            const query = `
              INSERT INTO paradas (ruta_id, nombre, codigo_parada, latitud, longitud, orden, capacidad_usuarios, usuarios_promedio, tiempo_espera_promedio_min, activa)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            const nombre = stop.nombre || stop.name || `Parada ${stop.id}`;
            const codigo = stop.codigo_parada || stop.codigo || `PARADA-${stop.id}`;
            const latitud = stop.latitud || stop.lat;
            const longitud = stop.longitud || stop.lon;
            const capacidad = stop.capacidad_usuarios || stop.capacity || 50;
            const usuarios = stop.usuarios_promedio || stop.daily_users || 0;
            
            const values = [
              routeId,
              nombre,
              codigo,
              latitud || null,
              longitud || null,
              orden,
              capacidad,
              usuarios,
              3,
              true
            ];

            await pool.execute(query, values);
            successCount++;
          } catch (error) {
            log.warning(`Error migrando parada "${stop.name || stop.nombre}" en ruta ${routeId}: ${error.message}`);
          }
        }
      } catch (error) {
        log.warning(`Error migrando parada ${stop.id}: ${error.message}`);
      }
    }
    
    log.success(`${successCount}/${stops.length} paradas migradas`);
    return successCount;
  } catch (error) {
    log.error(`Error en migración de paradas: ${error.message}`);
    throw error;
  }
}

/**
 * Verificar migración
 */
async function verifyMigration(pool) {
  try {
    log.info(`Verificando integridad de datos...`);
    
    const [routesResult] = await pool.execute('SELECT COUNT(*) as count FROM rutas');
    const [vehiclesResult] = await pool.execute('SELECT COUNT(*) as count FROM vehiculos');
    const [stopsResult] = await pool.execute('SELECT COUNT(*) as count FROM paradas');
    
    const routesCount = routesResult[0].count;
    const vehiclesCount = vehiclesResult[0].count;
    const stopsCount = stopsResult[0].count;
    
    log.success(`📊 Verificación completada:`);
    console.log(`   • Rutas: ${routesCount}`);
    console.log(`   • Vehículos: ${vehiclesCount}`);
    console.log(`   • Paradas: ${stopsCount}`);
    
    return { routesCount, vehiclesCount, stopsCount };
  } catch (error) {
    log.error(`Error en verificación: ${error.message}`);
    throw error;
  }
}

/**
 * Función principal
 */
async function main() {
  let pool = null;
  
  try {
    log.section('INICIAR MIGRACIÓN DE db.json A MySQL');
    
    // Paso 1: Preparar backup
    ensureBackupDir();
    const backupPath = createBackup();
    
    // Paso 2: Leer datos locales
    log.section('LEER DATOS LOCALES');
    const dbData = readDbJson();
    const routes = dbData.rutas || dbData.routes || [];
    const vehicles = dbData.vehiculos || dbData.vehicles || [];
    const stops = dbData.stops || dbData.paradas || [];
    
    log.info(`Encontrados: ${routes.length} rutas, ${vehicles.length} vehículos, ${stops.length} paradas`);
    
    // Paso 3: Conectar a MySQL
    log.section('CONECTAR A MySQL');
    pool = await connectToMySQL();
    
    // Paso 4: Migrar datos
    log.section('MIGRAR DATOS');
    await migrateRoutes(pool, routes);
    await migrateVehicles(pool, vehicles);
    await migrateStops(pool, stops, routes);
    
    // Paso 5: Verificar
    log.section('VERIFICAR MIGRACIÓN');
    const stats = await verifyMigration(pool);
    
    // Resumen final
    log.section('MIGRACIÓN COMPLETADA EXITOSAMENTE');
    console.log(`${colors.green}
    ✅ MIGRACIÓN EXITOSA
    
    📁 Backup guardado en: ${backupPath}
    
    📊 Datos migrados:
       • ${stats.routesCount} rutas
       • ${stats.vehiclesCount} vehículos
       • ${stats.stopsCount} paradas
    
    🔧 Próximos pasos:
       1. Verifica en phpMyAdmin: http://localhost/phpmyadmin
       2. Actualiza backend/.env: USE_LOCAL_DB=false
       3. Reinicia el servidor: npm run start
       4. Prueba los endpoints: http://localhost:3000/api/routes
    ${colors.reset}`);
    
  } catch (error) {
    log.error(`MIGRACIÓN FALLIDA: ${error.message}`);
    console.log(`\n${colors.red}${error.stack}${colors.reset}`);
    process.exit(1);
  } finally {
    if (pool) {
      await pool.end();
      log.info('Conexión a MySQL cerrada');
    }
  }
}

// Ejecutar
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
