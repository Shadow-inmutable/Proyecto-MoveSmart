-- =================================================================
-- DATOS INICIALES PARA MOVESMART
-- =================================================================
-- Inserta datos de ejemplo basados en Manizales (Colombia)
-- =================================================================

USE move_smart_db;

-- =================================================================
-- INSERTAR USUARIOS
-- =================================================================
INSERT INTO usuarios (nombre, email, rol, contraseña, activo) VALUES
-- 👤 ANALISTAS (Secretaría de Movilidad / Operadores)
('Juan Analista', 'juan.analista@movesmart.com', 'analista', '$2b$10$/TZ36z1Fqi53ETziT8ZfaO/99CIySSUZN7pxNe/ArpLcNr3BfsBfW', TRUE),
('María Analista', 'maria.analista@movesmart.com', 'analista', '$2b$10$nrI5XKqaTX6zbU6vnMb5JOtS0QtFHQuhWwEX2B3sbGQLjXQJWy6Ze', TRUE),
-- 👑 ADMINISTRADORES (Product Owners / Developers)
('Brandon Berrio', 'brandon.berrio@movesmart.com', 'administrador', '$2b$10$r04PDBsm4p2ZocnJ8d5l/O2nuvEK5pFRq6oeTew3j6T3AAeVzCxbi', TRUE),
('Ángel Camilo', 'angel.camilo@movesmart.com', 'administrador', '$2b$10$5MfD6CwEb.ChOKdK/8xoZeOjGU7heFMI0lvEHsTkKbLBWCilJbj2i', TRUE),
-- 👥 CIUDADANOS (Usuarios Públicos)
('Carlos Ciudadano', 'carlos.ciudadano@movesmart.com', 'ciudadano', '$2b$10$QDEuQGyRcC4iLaTxQNqV6Ojbby7zZDq1/zGiWYaHM4WAoWa68dLvG', TRUE),
('Laura Ciudadana', 'laura.ciudadana@movesmart.com', 'ciudadano', '$2b$10$wiTWnbB8yNc2H60spXIGyuehDBxzmPzYcuwIxefSAmnoJezAem7Be', TRUE);

-- =================================================================
-- INSERTAR RUTAS (Manizales)
-- =================================================================
INSERT INTO rutas (nombre, codigo, origen, destino, distancia_km, tiempo_estimado_min, paradas_totales, activa) VALUES
('Centro - Fundadores', 'R001', 'Terminal Central', 'Barrio Fundadores', 8.5, 35, 10, TRUE),
('Palogrande - Villamaría', 'R002', 'Palogrande', 'Villamaría', 12.3, 45, 9, TRUE),
('Neira - Industrial', 'R003', 'Neira', 'Zona Industrial', 15.8, 55, 8, TRUE),
('Arví - Puerto Íguana', 'R004', 'Barrio Arví', 'Puerto Íguana', 10.2, 40, 7, TRUE),
('La Macarena - Cervantes', 'R005', 'La Macarena', 'Cervantes', 6.5, 25, 6, TRUE);

-- =================================================================
-- INSERTAR PARADAS
-- =================================================================
INSERT INTO paradas (ruta_id, nombre, codigo_parada, latitud, longitud, orden, capacidad_usuarios, usuarios_promedio, tiene_semaforo, tiempo_espera_promedio_min, activa) VALUES
-- Ruta R001: Centro - Fundadores
(1, 'Terminal Central', 'P001', 5.0672, -75.5148, 1, 100, 80, TRUE, 5, TRUE),
(1, 'Calle 19 Centro', 'P002', 5.0680, -75.5140, 2, 60, 45, TRUE, 2, TRUE),
(1, 'Avenida Santander', 'P003', 5.0695, -75.5125, 3, 75, 55, TRUE, 3, TRUE),
(1, 'Paseo Peatonal', 'P004', 5.0720, -75.5100, 4, 50, 40, FALSE, 2, TRUE),
(1, 'Calle 21', 'P005', 5.0750, -75.5080, 5, 45, 30, FALSE, 2, TRUE),
(1, 'Parque Bolívar', 'P006', 5.0780, -75.5050, 6, 55, 35, TRUE, 3, TRUE),
(1, 'Calle 27', 'P007', 5.0810, -75.5020, 7, 40, 25, FALSE, 2, TRUE),
(1, 'Barrio Fundadores - 1', 'P008', 5.0850, -75.4990, 8, 60, 40, TRUE, 2, TRUE),
(1, 'Barrio Fundadores - 2', 'P009', 5.0880, -75.4960, 9, 50, 35, FALSE, 1, TRUE),
(1, 'Fundadores Final', 'P010', 5.0900, -75.4940, 10, 30, 20, FALSE, 1, TRUE),

-- Ruta R002: Palogrande - Villamaría
(2, 'Palogrande Inicio', 'P011', 5.1200, -75.5300, 1, 70, 50, TRUE, 4, TRUE),
(2, 'Colegio Mayor', 'P012', 5.1180, -75.5250, 2, 80, 60, TRUE, 3, TRUE),
(2, 'Laureles', 'P013', 5.1150, -75.5200, 3, 60, 45, FALSE, 2, TRUE),
(2, 'La Popa', 'P014', 5.1100, -75.5150, 4, 55, 40, TRUE, 3, TRUE),
(2, 'Villamaría Centro', 'P015', 5.1050, -75.5080, 5, 85, 65, TRUE, 4, TRUE),
(2, 'Villamaría Industrial', 'P016', 5.1000, -75.5000, 6, 75, 50, FALSE, 2, TRUE),
(2, 'Salida Villamaría', 'P017', 5.0950, -75.4950, 7, 50, 35, FALSE, 2, TRUE),
(2, 'Cruce Villamaría', 'P018', 5.0900, -75.4900, 8, 40, 30, FALSE, 1, TRUE),
(2, 'Villamaría Final', 'P019', 5.0850, -75.4850, 9, 35, 25, FALSE, 1, TRUE),

-- Ruta R003: Neira - Industrial
(3, 'Neira Entrada', 'P020', 5.0500, -75.5400, 1, 90, 70, TRUE, 5, TRUE),
(3, 'Neira Centro', 'P021', 5.0480, -75.5350, 2, 75, 55, TRUE, 3, TRUE),
(3, 'Neira Comercial', 'P022', 5.0450, -75.5300, 3, 65, 50, FALSE, 2, TRUE),
(3, 'Camino a Industrial', 'P023', 5.0400, -75.5200, 4, 55, 40, FALSE, 2, TRUE),
(3, 'Zona Industrial Entrada', 'P024', 5.0350, -75.5100, 5, 100, 80, TRUE, 4, TRUE),
(3, 'Zona Industrial Centro', 'P025', 5.0300, -75.5000, 6, 85, 65, TRUE, 3, TRUE),
(3, 'Zona Industrial Salida', 'P026', 5.0250, -75.4900, 7, 70, 50, FALSE, 2, TRUE),
(3, 'Industrial Final', 'P027', 5.0200, -75.4800, 8, 50, 35, FALSE, 1, TRUE),

-- Ruta R004: Arví - Puerto Íguana
(4, 'Arví Inicio', 'P028', 5.1400, -75.4800, 1, 65, 45, TRUE, 3, TRUE),
(4, 'Arví Centro', 'P029', 5.1380, -75.4750, 2, 60, 40, FALSE, 2, TRUE),
(4, 'Salida Arví', 'P030', 5.1350, -75.4700, 3, 55, 35, FALSE, 2, TRUE),
(4, 'Puerto Íguana Camino', 'P031', 5.1300, -75.4600, 4, 50, 30, FALSE, 2, TRUE),
(4, 'Puerto Íguana Centro', 'P032', 5.1250, -75.4500, 5, 75, 50, TRUE, 3, TRUE),
(4, 'Puerto Íguana Industrial', 'P033', 5.1200, -75.4450, 6, 65, 45, FALSE, 2, TRUE),
(4, 'Puerto Íguana Final', 'P034', 5.1150, -75.4400, 7, 40, 25, FALSE, 1, TRUE),

-- Ruta R005: La Macarena - Cervantes
(5, 'La Macarena Inicio', 'P035', 5.0300, -75.5600, 1, 75, 55, TRUE, 4, TRUE),
(5, 'La Macarena Centro', 'P036', 5.0280, -75.5550, 2, 65, 45, FALSE, 2, TRUE),
(5, 'Hacia Cervantes', 'P037', 5.0250, -75.5500, 3, 55, 40, FALSE, 2, TRUE),
(5, 'Cervantes Entrada', 'P038', 5.0200, -75.5400, 4, 80, 60, TRUE, 3, TRUE),
(5, 'Cervantes Centro', 'P039', 5.0150, -75.5300, 5, 70, 50, FALSE, 2, TRUE),
(5, 'Cervantes Final', 'P040', 5.0100, -75.5200, 6, 50, 35, FALSE, 1, TRUE);

-- =================================================================
-- INSERTAR VEHÍCULOS
-- =================================================================
INSERT INTO vehiculos (ruta_id, placa, modelo, capacidad_asientos, capacidad_parados, consumo_combustible_km, año_fabricacion, ultimo_mantenimiento, proximo_mantenimiento, estado, activo) VALUES
-- Ruta R001
(1, 'TSL-001', 'Mercedes Benz Citaro', 45, 20, 5.2, 2020, '2025-01-15', '2025-04-15', 'disponible', TRUE),
(1, 'TSL-002', 'Volvo B7RLE', 48, 22, 5.5, 2019, '2025-01-10', '2025-04-10', 'disponible', TRUE),

-- Ruta R002
(2, 'TSL-003', 'Mercedes Benz Citaro', 45, 20, 5.2, 2021, '2025-01-20', '2025-04-20', 'disponible', TRUE),
(2, 'TSL-004', 'MAN A23', 50, 25, 5.8, 2018, '2025-01-12', '2025-04-12', 'mantenimiento', TRUE),

-- Ruta R003
(3, 'TSL-005', 'Mercedes Benz Citaro', 45, 20, 5.2, 2020, '2025-01-18', '2025-04-18', 'disponible', TRUE),
(3, 'TSL-006', 'Scania K280', 52, 25, 6.0, 2017, '2025-01-08', '2025-04-08', 'disponible', TRUE),

-- Ruta R004
(4, 'TSL-007', 'Mercedes Benz Citaro', 45, 20, 5.2, 2019, '2025-01-16', '2025-04-16', 'disponible', TRUE),

-- Ruta R005
(5, 'TSL-008', 'Volvo B7RLE', 48, 22, 5.5, 2020, '2025-01-14', '2025-04-14', 'disponible', TRUE),
(5, 'TSL-009', 'Mercedes Benz Citaro', 45, 20, 5.2, 2021, '2025-01-22', '2025-04-22', 'disponible', TRUE);

-- =================================================================
-- INSERTAR MÉTRICAS
-- =================================================================
INSERT INTO metricas (ruta_id, fecha, usuarios_totales, ocupacion_promedio_porcentaje, tiempo_promedio_recorrido_min, combustible_consumido_litros, vehiculos_utilizados, paradas_completadas, incidentes, demoras_promedio_min) VALUES
(1, '2025-02-07', 850, 78.5, 36, 45.3, 2, 20, 0, 2, 4.5),
(2, '2025-02-07', 650, 72.3, 46, 38.2, 2, 18, 1, 3, 4.3),
(3, '2025-02-07', 920, 85.2, 57, 52.1, 2, 16, 0, 1, 4.6),
(4, '2025-02-07', 480, 65.8, 41, 28.5, 1, 14, 0, 2, 4.4),
(5, '2025-02-07', 320, 58.3, 26, 18.9, 1, 12, 0, 1, 4.2);

-- =================================================================
-- INSERTAR REPORTES
-- =================================================================
INSERT INTO reportes (usuario_id, tipo_reporte, titulo, contenido, ruta_id, periodo_desde, periodo_hasta, estado) VALUES
(1, 'diario', 'Reporte Diario Ruta Centro-Fundadores', 'Análisis de operaciones del día 7 de febrero', 1, '2025-02-07', '2025-02-07', 'generado'),
(2, 'semanal', 'Reporte Semanal Palogrande-Villamaría', 'Análisis de la semana del 3 al 7 de febrero', 2, '2025-02-03', '2025-02-07', 'generado'),

-- =================================================================
-- INSERTAR ZONAS CRÍTICAS
-- Descripción: Puntos de congestión en Manizales con niveles de alerta
-- =================================================================
INSERT INTO zonas_criticas (nombre, descripcion, latitud, longitud, nivel_congestion, color_hex) VALUES
-- 🟢 Zonas de congestión BAJA
('Terminal Central - Entrada', 'Acceso ordinario a terminal de transporte', 5.0672, -75.5148, 'bajo', '#33ff57'),
('Parque Bolívar - Sur', 'Zona residencial con bajo flujo', 5.0780, -75.5050, 'bajo', '#33ff57'),
('Laureles - Comercio', 'Zona comercial de acceso regulado', 5.1150, -75.5200, 'bajo', '#33ff57'),

-- 🟠 Zonas de congestión MEDIA
('Intersección Calle 19 Centro', 'Punto crítico - horas pico matutino', 5.0680, -75.5140, 'medio', '#ff7f00'),
('Avenida Santander - Centro', 'Zona comercial con flujo moderado', 5.0695, -75.5125, 'medio', '#ff7f00'),
('Palogrande - Colegio Mayor', 'Acceso educativo con congestión moderada', 5.1180, -75.5250, 'medio', '#ff7f00'),
('Villamaría Centro - Comercio', 'Intersección de rutas con tráfico intermedio', 5.1050, -75.5080, 'medio', '#ff7f00'),

-- 🔴 Zonas de congestión ALTA
('Paseo Peatonal - Avenida Cervantes', 'Zona de alto comercio, congestión habitual', 5.0720, -75.5100, 'alto', '#ff3333'),
('Zona Industrial Entrada', 'Acceso vehicular intenso, horas laborales', 5.0350, -75.5100, 'alto', '#ff3333'),
('Neira - Centro Urbano', 'Cruce de transporte principal, demora frecuente', 5.0480, -75.5350, 'alto', '#ff3333'),

-- 🩸 Zonas de congestión CRÍTICA
('Terminal Central - Salida', 'Punto de máxima congestión, horas pico', 5.0672, -75.5158, 'critico', '#cc0000'),
('Puerto Íguana Industrial', 'Zona de carga/descarga con caos vehicular', 5.1200, -75.4450, 'critico', '#cc0000');

-- =================================================================
-- FIN DE DATOS INICIALES
-- =================================================================
