import express from 'express';
import clienteRoutes from './src/backend/routes/cliente.routes.js';
import proveedorRoutes from './src/backend/routes/proveedor.routes.js';
import productoRoutes from './src/backend/routes/producto.routes.js';
import facturaRoutes from './src/backend/routes/factura.routes.js';

const app = express();
const port = 3001;

app.use(express.json());

app.use('/api', clienteRoutes);
app.use('/api', proveedorRoutes);
app.use('/api', productoRoutes);
app.use('/api', facturaRoutes);

app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});
