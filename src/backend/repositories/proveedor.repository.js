import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const findMany = async () => {
  return await prisma.proveedor.findMany();
};

export const create = async (proveedor) => {
  return await prisma.proveedor.create({
    data: proveedor,
  });
};

export const findUnique = async (id) => {
  return await prisma.proveedor.findUnique({
    where: { id },
  });
};

export const update = async (id, proveedor) => {
  return await prisma.proveedor.update({
    where: { id },
    data: proveedor,
  });
};

export const remove = async (id) => {
  return await prisma.proveedor.delete({
    where: { id },
  });
};
