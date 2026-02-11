
CREATE DATABASE IF NOT EXISTS move_smart_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE move_smart_db;


CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'gestor', 'ciudadano') DEFAULT 'ciudadano'
);

CREATE TABLE rutas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo ENUM('actual', 'optimizada') DEFAULT 'actual',
    color_hex VARCHAR(7)
);



CREATE TABLE paradas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ruta_id INT,
    nombre VARCHAR(100),
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    orden INT NOT NULL DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ruta_id) REFERENCES rutas(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS vehiculos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ruta_id INT,
  placa VARCHAR(20) UNIQUE NOT NULL,
  modelo VARCHAR(100),
  capacidad_asientos INT DEFAULT 45,
  capacidad_parados INT DEFAULT 20,
  consumo_combustible_km DECIMAL(5, 2),
  año_fabricacion INT,
  ultimo_mantenimiento DATE,
  proximo_mantenimiento DATE,
  estado ENUM('disponible', 'mantenimiento', 'fuera_servicio') DEFAULT 'disponible',
  activo BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (ruta_id) REFERENCES rutas(id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_ruta_id (ruta_id),
  INDEX idx_placa (placa),
  INDEX idx_estado (estado),
  INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Vehículos del sistema';


CREATE TABLE zonas_criticas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    nivel_congestion ENUM('bajo', 'medio', 'alto'),
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    radio_metros INT DEFAULT 300
);
