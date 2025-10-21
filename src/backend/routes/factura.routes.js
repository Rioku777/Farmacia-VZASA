import { Router } from 'express';
import { getFacturas, createFactura, getFactura, updateFactura, deleteFactura } from '../controllers/factura.controller.js';

const router = Router();

router.get('/facturas', getFacturas);
router.post('/facturas', createFactura);
router.get('/facturas/:id', getFactura);
router.put('/facturas/:id', updateFactura);
router.delete('/facturas/:id', deleteFactura);

export default router;
