import { Router } from 'express';
import { getClientes, createCliente, getCliente, updateCliente, deleteCliente } from '../controllers/cliente.controller.js';

const router = Router();

router.get('/clientes', getClientes);
router.post('/clientes', createCliente);
router.get('/clientes/:id', getCliente);
router.put('/clientes/:id', updateCliente);
router.delete('/clientes/:id', deleteCliente);

export default router;
