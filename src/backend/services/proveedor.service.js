import * as proveedorRepository from '../repositories/proveedor.repository.js';

export const getProveedores = async () => {
  return await proveedorRepository.findMany();
};

export const createProveedor = async (proveedor) => {
  return await proveedorRepository.create(proveedor);
};

export const getProveedor = async (id) => {
  return await proveedorRepository.findUnique(id);
};

export const updateProveedor = async (id, proveedor) => {
  return await proveedorRepository.update(id, proveedor);
};

export const deleteProveedor = async (id) => {
  return await proveedorRepository.remove(id);
};
