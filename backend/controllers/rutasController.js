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