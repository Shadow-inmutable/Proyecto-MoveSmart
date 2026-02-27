export const getRutas = async (req, res) => {
    const [routes] = await req.db.query('SELECT * FROM rutas');
    res.json({ success: true, data: routes });
};

export const createRuta = async (req, res) => {
    if (req.user.rol !== 'gestor') return res.status(403).json({ error: 'Acceso denegado' });
    const { nombre, tipo, color_hex, distancia_km } = req.body;
    const tiempo_estimado = Math.round(distancia_km * 3.5); 
    const eficiencia = Math.floor(Math.random() * (95 - 70 + 1)) + 70; 
    try {
        const [result] = await req.db.query(
            'INSERT INTO rutas (nombre, tipo, color_hex, distancia_km, tiempo_estimado_min, eficiencia_porcentaje) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, tipo || 'actual', color_hex || '#3498db', distancia_km, tiempo_estimado, eficiencia]
        );
        res.status(201).json({ success: true, data: { id: result.insertId, tiempo_estimado, eficiencia } });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

export const updateRuta = async (req, res) => {
    if (req.user.rol !== 'gestor') return res.status(403).json({ error: 'No autorizado' });
    const { id } = req.params;
    const { nombre, tipo, color_hex, distancia_km } = req.body;
    try {
        await req.db.query('UPDATE rutas SET nombre = ?, tipo = ?, color_hex = ?, distancia_km = ? WHERE id = ?', [nombre, tipo, color_hex, distancia_km, id]);
        res.json({ success: true, message: 'Ruta actualizada' });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

export const deleteRuta = async (req, res) => {
    if (req.user.rol !== 'gestor') return res.status(403).json({ error: 'No autorizado' });
    const { id } = req.params;
    try {
        await req.db.query('DELETE FROM rutas WHERE id = ?', [id]);
        res.json({ success: true, message: 'Ruta eliminada' });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

export const getZonas = async (req, res) => {
    const [zonas] = await req.db.query('SELECT * FROM zonas_criticas');
    res.json({ success: true, data: zonas });
};

export const createZona = async (req, res) => {
    if (req.user.rol !== 'gestor') return res.status(403).json({ error: 'No autorizado' });
    const { nombre, nivel_congestion, latitud, longitud, descripcion_impacto} = req.body;
    try {
        await req.db.query('INSERT INTO zonas_criticas (nombre, nivel_congestion, latitud, longitud, descripcion_impacto) VALUES (?, ?, ?, ?, ?)', 
            [nombre, nivel_congestion, latitud, longitud, descripcion_impacto]);
        res.json({ success: true, message: 'Zona crítica registrada' });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

export const putZona = async (req, res) => {
    if (req.user.rol !== 'gestor') return res.status(403).json({ error: 'No autorizado' });
    const { id } = req.params;
    const { nombre, nivel_congestion, latitud, longitud, descripcion_impacto } = req.body;
    try {
        await req.db.query(
            'UPDATE zonas_criticas SET nombre = ?, nivel_congestion = ?, latitud = ?, longitud = ?, descripcion_impacto = ? WHERE id = ?',
            [nombre, nivel_congestion, latitud, longitud, descripcion_impacto, id]
        );
        res.json({ success: true, message: 'Zona crítica actualizada' });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

export const deleteZona = async (req, res) => {
    if (req.user.rol !== 'gestor') return res.status(403).json({ error: 'No autorizado' });
    const { id } = req.params;
    try {
        await req.db.query('DELETE FROM zonas_criticas WHERE id = ?', [id]);
        res.json({ success: true, message: 'Zona crítica eliminada' });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};
export const getParada = async (req, res) => {
    try {
        
        const [rows] = await req.db.query('SELECT * FROM paradas ORDER BY ruta_id, orden ASC');
        res.json({ 
            success: true, 
            data: rows 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const createParada = async (req, res) => {
    try {
        const { ruta_id, nombre, latitud, longitud, orden } = req.body;

        if (req.user.rol !== 'gestor') {
            return res.status(403).json({ message: "No tienes permiso para modificar rutas" });
        }

        await req.db.query(
            'INSERT INTO paradas (ruta_id, nombre, latitud, longitud, orden) VALUES (?, ?, ?, ?, ?)',
            [ruta_id, nombre, latitud, longitud, orden]
        );
        res.status(201).json({ success: true, message: 'Parada de ruta añadida correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateParada = async (req, res) => {
    try {
        // 1. Verificación de Rol
        if (req.user.rol !== 'gestor') {
            return res.status(403).json({ success: false, error: 'No autorizado' });
        }

        const { id } = req.params;
        const { nombre, latitud, longitud, orden } = req.body;

        const [result] = await req.db.query(
            'UPDATE paradas SET nombre = ?, latitud = ?, longitud = ?, orden = ? WHERE id = ?',
            [nombre, latitud, longitud, orden, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: 'Parada no encontrada' });
        }

        res.json({ success: true, message: 'Parada actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


export const deleteParada = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user.rol !== 'gestor') return res.status(403).json({ message: "No autorizado" });

        await req.db.query('DELETE FROM paradas WHERE id = ?', [id]);
        res.json({ success: true, message: 'Parada eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};