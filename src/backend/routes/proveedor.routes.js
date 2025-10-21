import { Router } from 'express';
import { getProveedores, createProveedor, getProveedor, updateProveedor, deleteProveedor } from '../controllers/proveedor.controller.js';

const router = Router();

router.get('/proveedores', getProveedores);
router.post('/proveedores', createProveedor);
router.get('/proveedores/:id', getProveedor);
router.put('/proveedores/:id', updateProveedor);
router.delete('/proveedores/:id', deleteProveedor);

export default router;
