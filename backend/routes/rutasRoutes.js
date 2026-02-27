import express from 'express';
import { 
    getRutas, 
    createRuta, 
    updateRuta, 
    deleteRuta, 
    getZonas, 
    createZona,
    putZona, 
    deleteZona,
    getParada,
    createParada,
    updateParada,
    deleteParada 

} from '../controllers/rutasController.js';

import { verificarToken } from '../middlewares/authMiddleware.js'; 

const router = express.Router();

router.get('/', getRutas);
router.post('/', verificarToken, createRuta);
router.put('/:id', verificarToken, updateRuta);
router.delete('/:id', verificarToken, deleteRuta);

router.get('/zonas', getZonas);
router.post('/zonas', verificarToken, createZona);
router.put('/zonas/:id', verificarToken, putZona);
router.delete('/zonas/:id', verificarToken, deleteZona);
router.get('/paradas', getParada);
router.post('/paradas', verificarToken, createParada);
router.put('/paradas/:id', verificarToken, updateParada);
router.delete('/paradas/:id', verificarToken, deleteParada);
export default router;