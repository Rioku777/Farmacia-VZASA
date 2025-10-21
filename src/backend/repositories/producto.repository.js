import { prisma } from '../lib/prisma.js';

export const findMany = async () => {
  return await prisma.producto.findMany({
    include: {
      proveedor: true,
    },
  });
};

export const create = async (producto) => {
  return await prisma.producto.create({
    data: producto,
  });
};

export const findUnique = async (id) => {
  return await prisma.producto.findUnique({
    where: { id },
    include: {
      proveedor: true,
    },
  });
};

export const update = async (id, producto) => {
  return await prisma.producto.update({
    where: { id },
    data: producto,
  });
};

export const remove = async (id) => {
  return await prisma.producto.delete({
    where: { id },
  });
};
