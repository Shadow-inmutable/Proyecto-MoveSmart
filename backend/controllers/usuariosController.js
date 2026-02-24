import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_manizales';



export const registro = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;

    const rolSolicitado = rol ? rol.toLowerCase() : 'ciudadano';

        let rolFinal = 'ciudadano'; // Por defecto es ciudadano

        if (rolSolicitado === 'gestor') {
            // VERIFICACIÓN: ¿Existe un usuario autenticado y es gestor?
            if (req.user && req.user.rol === 'gestor') {
                rolFinal = 'gestor';
            } else {
                // Si no hay token o no es gestor, BLOQUEAMOS
                return res.status(403).json({ 
                    success: false, 
                    message: "No puedes asignarte el rol de Gestor. Solo un administrador puede hacerlo." 
                });
            }
        } else {
            // Si solicita cualquier otro rol (o ninguno), queda como ciudadano
            rolFinal = rolSolicitado;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await req.db.query(
            'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
            [nombre, email, hashedPassword, rolFinal]
        );
        
        res.status(201).json({ 
            success: true, 
            message: `Usuario registrado exitosamente como ${rolFinal}` 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const [users] = await req.db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

        if (users.length === 0 || !(await bcrypt.compare(password, users[0].password))) {
            return res.status(401).json({ success: false, error: 'Credenciales incorrectas' });
        }

        const token = jwt.sign({ id: users[0].id, rol: users[0].rol }, JWT_SECRET, { expiresIn: '4h' });
        res.json({ success: true, token, user: { nombre: users[0].nombre, rol: users[0].rol } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};



/**
 * Obtener todos los usuarios
 */
export const getUsuarios = async (req, res) => {
    try {
       
        if (req.user.rol !== 'gestor') {
            return res.status(403).json({ success: false, error: 'No tienes permisos de administrador' });
        }

        // No traemos la contraseña por seguridad
        const [users] = await req.db.query('SELECT id, nombre, email, rol, fecha_registro FROM usuarios');
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Actualizar datos de un usuario
 */
export const updateUsuario = async (req, res) => {
    try {
        if (req.user.rol !== 'gestor') return res.status(403).json({ error: 'Acceso denegado' });
        
        const { id } = req.params;
        const { nombre, email, rol } = req.body;

        await req.db.query(
            'UPDATE usuarios SET nombre = ?, email = ?, rol = ? WHERE id = ?',
            [nombre, email, rol, id]
        );

        res.json({ success: true, message: 'Usuario actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Eliminar un usuario
 */
export const deleteUsuario = async (req, res) => {
    try {
        if (req.user.rol !== 'gestor') return res.status(403).json({ error: 'Acceso denegado' });

        const { id } = req.params;

        // Evitar que el gestor se borre a sí mismo por error (opcional pero recomendado)
        if (parseInt(id) === req.user.id) {
            return res.status(400).json({ success: false, error: 'No puedes eliminar tu propia cuenta administrativa' });
        }

        await req.db.query('DELETE FROM usuarios WHERE id = ?', [id]);
        res.json({ success: true, message: 'Usuario eliminado del sistema' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};