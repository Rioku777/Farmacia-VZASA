import { Router } from 'express';
import { getProductos, createProducto, getProducto, updateProducto, deleteProducto } from '../controllers/producto.controller.js';

const router = Router();

router.get('/productos', getProductos);
router.post('/productos', createProducto);
router.get('/productos/:id', getProducto);
router.put('/productos/:id', updateProducto);
router.delete('/productos/:id', deleteProducto);

export default router;
