// --- RUTAS ---
export const getRutas = async (req, res) => {
    try {
        const [routes] = await req.db.query('SELECT * FROM rutas');
        res.json({ success: true, data: routes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const createRuta = async (req, res) => {
    if (req.user.rol !== 'gestor') return res.status(403).json({ error: 'Acceso denegado' });
    
    const { nombre, tipo, color_hex, distancia_km } = req.body;

    if (!nombre || !distancia_km) {
        return res.status(400).json({ error: 'Nombre y distancia son campos obligatorios' });
    }

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
        const [actual] = await req.db.query('SELECT * FROM rutas WHERE id = ?', [id]);
        if (actual.length === 0) return res.status(404).json({ error: 'Ruta no encontrada' });

        await req.db.query(
            'UPDATE rutas SET nombre = ?, tipo = ?, color_hex = ?, distancia_km = ? WHERE id = ?', 
            [nombre || actual[0].nombre, tipo || actual[0].tipo, color_hex || actual[0].color_hex, distancia_km || actual[0].distancia_km, id]
        );
        res.json({ success: true, message: 'Ruta actualizada' });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

// --- ZONAS CRÍTICAS ---
export const createZona = async (req, res) => {
    if (req.user.rol !== 'gestor') return res.status(403).json({ error: 'No autorizado' });
    const { nombre, nivel_congestion, latitud, longitud, descripcion_impacto } = req.body;

    if (!nombre || latitud === undefined || longitud === undefined) {
        return res.status(400).json({ error: 'Faltan datos geográficos obligatorios' });
    }

    try {
        await req.db.query('INSERT INTO zonas_criticas (nombre, nivel_congestion, latitud, longitud, descripcion_impacto) VALUES (?, ?, ?, ?, ?)', 
            [nombre, nivel_congestion, latitud, longitud, descripcion_impacto]);
        res.json({ success: true, message: 'Zona crítica registrada' });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

// --- PARADAS (PUNTOS DE RUTA) ---
export const updateParada = async (req, res) => {
    try {
        if (req.user.rol !== 'gestor') return res.status(403).json({ success: false, error: 'No autorizado' });

        const { id } = req.params;
        const { nombre, latitud, longitud, orden } = req.body;

        const [actual] = await req.db.query('SELECT * FROM paradas WHERE id = ?', [id]);
        if (actual.length === 0) return res.status(404).json({ error: 'Parada no encontrada' });

        await req.db.query(
            'UPDATE paradas SET nombre = ?, latitud = ?, longitud = ?, orden = ? WHERE id = ?',
            [
                nombre !== undefined ? nombre : actual[0].nombre, 
                latitud !== undefined ? latitud : actual[0].latitud, 
                longitud !== undefined ? longitud : actual[0].longitud, 
                orden !== undefined ? orden : actual[0].orden, 
                id
            ]
        );

        res.json({ success: true, message: 'Parada actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
