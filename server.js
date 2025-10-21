import express from 'express';
import cors from 'cors';
import clienteRoutes from './src/backend/routes/cliente.routes.js';
import proveedorRoutes from './src/backend/routes/proveedor.routes.js';
import productoRoutes from './src/backend/routes/producto.routes.js';
import facturaRoutes from './src/backend/routes/factura.routes.js';
import { errorHandler } from './src/backend/middleware/errorHandler.js';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', clienteRoutes);
app.use('/api', proveedorRoutes);
app.use('/api', productoRoutes);
app.use('/api', facturaRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});
