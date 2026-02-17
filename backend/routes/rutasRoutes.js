import express from 'express';
import { 
    getRutas, 
    createRuta, 
    updateRuta, 
    deleteRuta, 
    getZonas, 
    createZona 
} from '../controllers/rutasController.js';

import { verificarToken } from '../middlewares/authMiddleware.js'; 

const router = express.Router();

router.get('/', getRutas);
router.post('/', verificarToken, createRuta);
router.put('/:id', verificarToken, updateRuta);
router.delete('/:id', verificarToken, deleteRuta);

router.get('/zonas', getZonas);
router.post('/zonas', verificarToken, createZona);

export default router;