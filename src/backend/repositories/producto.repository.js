import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const findMany = async () => {
  return await prisma.producto.findMany();
};

export const create = async (producto) => {
  return await prisma.producto.create({
    data: producto,
  });
};

export const findUnique = async (id) => {
  return await prisma.producto.findUnique({
    where: { id },
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
