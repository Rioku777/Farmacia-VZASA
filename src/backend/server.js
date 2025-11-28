
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './prisma.js';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Users
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });
    if (user && user.password === password) {
      res.json(user);
    } else {
      res.status(401).json({ error: 'Credenciales inválidas' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Products
app.get('/api/productos', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/productos', async (req, res) => {
  try {
    const { codigo, nombre, forma, proveedor, precio, stock, fechaVencimiento } = req.body;
    const newProduct = await prisma.product.create({
      data: { codigo, nombre, forma, proveedor, precio, stock, fechaVencimiento },
    });
    res.json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/productos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/productos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clients
app.get('/api/clientes', async (req, res) => {
  try {
    const clients = await prisma.client.findMany();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/clientes', async (req, res) => {
  try {
    const client = await prisma.client.create({ data: req.body });
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/clientes/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const client = await prisma.client.update({
        where: { id: parseInt(id) },
        data: req.body
      });
      res.json(client);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

app.delete('/api/clientes/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await prisma.client.delete({ where: { id: parseInt(id) } });
      res.json({ message: 'Cliente eliminado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// Providers
app.get('/api/proveedores', async (req, res) => {
    try {
      const providers = await prisma.provider.findMany();
      res.json(providers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

app.post('/api/proveedores', async (req, res) => {
    try {
      const provider = await prisma.provider.create({ data: req.body });
      res.json(provider);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

app.put('/api/proveedores/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const provider = await prisma.provider.update({
        where: { id: parseInt(id) },
        data: req.body
        });
        res.json(provider);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/proveedores/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.provider.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Proveedor eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Invoices
app.get('/api/facturas', async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: { items: true },
    });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/facturas', async (req, res) => {
  try {
    const { numero, fecha, cliente, total, subtotal, iva, usuario, items } = req.body;

    // Transaction: Create invoice, create items, update product stock
    const result = await prisma.$transaction(async (prisma) => {
      const newInvoice = await prisma.invoice.create({
        data: {
          numero,
          fecha: new Date(fecha),
          cliente,
          total,
          subtotal,
          iva,
          usuario,
          items: {
            create: items.map(item => ({
              nombre: item.nombre,
              precio: item.precio,
              cantidad: item.cantidad,
              subtotal: item.subtotal
            }))
          }
        },
        include: { items: true }
      });

      // Update Stock
      for (const item of items) {
        // Items in frontend might come with 'id' of the product.
        // We assume item.id is the product id.
        await prisma.product.update({
          where: { id: item.id },
          data: { stock: { decrement: item.cantidad } }
        });
      }

      return newInvoice;
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Config
app.get('/api/config', async (req, res) => {
  try {
    const config = await prisma.config.findFirst();
    res.json(config || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/config', async (req, res) => {
  try {
    // Upsert (update if exists, create if not)
    // Since we only want one config row, we can just grab the first one ID or create new
    const existing = await prisma.config.findFirst();
    let config;
    if (existing) {
        config = await prisma.config.update({
            where: { id: existing.id },
            data: req.body
        });
    } else {
        config = await prisma.config.create({ data: req.body });
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Seed Data Endpoint (One time use or dev)
app.post('/api/seed', async (req, res) => {
    try {
        const { users, productos, clientes, proveedores, config } = req.body;

        // Seed Users
        for (const u of users) {
            await prisma.user.upsert({
                where: { username: u.username },
                update: {},
                create: { username: u.username, password: u.password, role: u.role }
            });
        }

        // Seed Products
        for (const p of productos) {
            await prisma.product.create({
               data: {
                 nombre: p.nombre,
                 codigo: p.codigo,
                 forma: p.forma,
                 proveedor: p.proveedor,
                 precio: p.precio,
                 stock: p.stock,
                 fechaVencimiento: p.fechaVencimiento
               }
            });
        }

        // Seed Clients
        for (const c of clientes) {
            await prisma.client.create({ data: { nombre: c.nombre, email: c.email, telefono: c.telefono, direccion: c.direccion, notas: c.notas } });
        }

        // Seed Providers
        for (const p of proveedores) {
            await prisma.provider.create({ data: { nombre: p.nombre, email: p.email, telefono: p.telefono, direccion: p.direccion, notas: p.notas } });
        }

        // Seed Config
        if (config) {
             await prisma.config.create({ data: config });
        }

        res.json({ message: "Seeded successfully" });

    } catch(e) {
        res.status(500).json({error: e.message});
    }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
