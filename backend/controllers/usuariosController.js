import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_manizales';

export const registro = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await req.db.query(
            'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
            [nombre, email, hashedPassword, rol || 'ciudadano']
        );
        res.status(201).json({ success: true, message: 'Usuario registrado' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    const [users] = await req.db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (users.length === 0 || !(await bcrypt.compare(password, users[0].password))) {
        return res.status(401).json({ success: false, error: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ id: users[0].id, rol: users[0].rol }, JWT_SECRET, { expiresIn: '4h' });
    res.json({ success: true, token, user: { nombre: users[0].nombre, rol: users[0].rol } });
};