
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initialData = {
  users: [
    { id: 1, username: 'admin', password: 'admin123', role: 'Administrador' },
    { id: 2, username: 'vendedor', password: 'vendedor123', role: 'Vendedor' }
  ],
  productos: [
    { id: 1, codigo: 'MED001', nombre: 'Paracetamol 500mg', forma: 'Pastillas', proveedor: 'Farmacéutica Nacional', precio: 25.50, stock: 150, fechaVencimiento: '2025-12-31' },
    { id: 2, codigo: 'MED002', nombre: 'Ibuprofeno 400mg', forma: 'Cápsulas', proveedor: 'Laboratorios Unidos', precio: 35.00, stock: 80, fechaVencimiento: '2026-06-30' },
    { id: 3, codigo: 'MED003', nombre: 'Amoxicilina 500mg', forma: 'Suspensión', proveedor: 'Farmacéutica Nacional', precio: 45.75, stock: 5, fechaVencimiento: '2025-12-15' },
    { id: 4, codigo: 'VIT001', nombre: 'Vitamina C 1000mg', forma: 'Tabletas Efervescentes', proveedor: 'Suplenat', precio: 120.00, stock: 0, fechaVencimiento: '2026-01-31' },
  ],
  clientes: [
    { id: 1, nombre: 'María González', telefono: '8888-1234', email: 'maria@email.com', direccion: 'Nindirí Centro', notas: 'Cliente frecuente' }
  ],
  proveedores: [
    { id: 1, nombre: 'Farmacéutica Nacional', telefono: '2222-5678', email: 'ventas@farmanacional.com', direccion: 'Managua, Nicaragua', notas: 'Proveedor principal' },
    { id: 2, nombre: 'Laboratorios Unidos', telefono: '2233-4455', email: 'contacto@labunidos.com', direccion: 'Carretera Masaya', notas: '' }
  ],
  config: {
    nombreFarmacia: 'Farmacia V&ZASA',
    direccion: 'Nindirí, Nicaragua',
    telefono: '8888-0000',
    email: 'info@vzasa.com',
    iva: 15
  }
};

const seed = async () => {
  try {
    // Seed Users
    for (const u of initialData.users) {
        await prisma.user.upsert({
            where: { username: u.username },
            update: {},
            create: { username: u.username, password: u.password, role: u.role }
        });
    }

    // Seed Products
    for (const p of initialData.productos) {
       const exists = await prisma.product.findFirst({ where: { nombre: p.nombre } });
       if (!exists) {
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
    }

    // Clients
    for (const c of initialData.clientes) {
        const exists = await prisma.client.findFirst({ where: { nombre: c.nombre } });
        if (!exists) {
            await prisma.client.create({ data: { nombre: c.nombre, email: c.email, telefono: c.telefono, direccion: c.direccion, notas: c.notas } });
        }
    }

    // Providers
    for (const p of initialData.proveedores) {
        const exists = await prisma.provider.findFirst({ where: { nombre: p.nombre } });
        if (!exists) {
            await prisma.provider.create({ data: { nombre: p.nombre, email: p.email, telefono: p.telefono, direccion: p.direccion, notas: p.notas } });
        }
    }

    // Config
    const configCount = await prisma.config.count();
    if (configCount === 0 && initialData.config) {
         await prisma.config.create({ data: initialData.config });
    }

    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

seed();
