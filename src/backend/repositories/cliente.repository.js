import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const findMany = async () => {
  return await prisma.cliente.findMany();
};

export const create = async (cliente) => {
  return await prisma.cliente.create({
    data: cliente,
  });
};

export const findUnique = async (id) => {
  return await prisma.cliente.findUnique({
    where: { id },
  });
};

export const update = async (id, cliente) => {
  return await prisma.cliente.update({
    where: { id },
    data: cliente,
  });
};

export const remove = async (id) => {
  return await prisma.cliente.delete({
    where: { id },
  });
};
