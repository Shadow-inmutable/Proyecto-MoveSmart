import express from 'express';
import { getUsuarios, updateUsuario, deleteUsuario, registro, login } from '../controllers/usuariosController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/registro', verificarToken, registro);
router.post('/login', login);
router.get('/', verificarToken, getUsuarios);         
router.put('/:id', verificarToken, updateUsuario);     
router.delete('/:id', verificarToken, deleteUsuario);  
export default router;