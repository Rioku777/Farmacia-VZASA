import * as clienteRepository from '../repositories/cliente.repository.js';

export const getClientes = async () => {
  return await clienteRepository.findMany();
};

export const createCliente = async (cliente) => {
  return await clienteRepository.create(cliente);
};

export const getCliente = async (id) => {
  return await clienteRepository.findUnique(id);
};

export const updateCliente = async (id, cliente) => {
  return await clienteRepository.update(id, cliente);
};

export const deleteCliente = async (id) => {
  return await clienteRepository.remove(id);
};
