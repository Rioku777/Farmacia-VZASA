import { prisma } from '../lib/prisma.js';

export const findMany = async () => {
  return await prisma.factura.findMany({
    include: {
      cliente: true,
      usuario: true,
      detalles: {
        include: {
          producto: true,
        },
      },
    },
  });
};

export const create = async (factura) => {
  const { detalles, ...facturaData } = factura;
  return await prisma.factura.create({
    data: {
      ...facturaData,
      detalles: {
        create: detalles,
      },
    },
    include: {
      detalles: true,
    },
  });
};

export const findUnique = async (id) => {
  return await prisma.factura.findUnique({
    where: { id },
    include: {
      cliente: true,
      usuario: true,
      detalles: {
        include: {
          producto: true,
        },
      },
    },
  });
};

export const update = async (id, factura) => {
  const { detalles, ...facturaData } = factura;
  return await prisma.factura.update({
    where: { id },
    data: {
      ...facturaData,
      detalles: {
        deleteMany: {},
        create: detalles,
      },
    },
    include: {
      detalles: true,
    },
  });
};

export const remove = async (id) => {
  await prisma.facturaDetalle.deleteMany({
    where: { facturaId: id },
  });
  return await prisma.factura.delete({
    where: { id },
  });
};
