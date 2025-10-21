import * as productoRepository from '../repositories/producto.repository.js';

export const getProductos = async () => {
  return await productoRepository.findMany();
};

export const createProducto = async (producto) => {
  return await productoRepository.create(producto);
};

export const getProducto = async (id) => {
  return await productoRepository.findUnique(id);
};

export const updateProducto = async (id, producto) => {
  return await productoRepository.update(id, producto);
};

export const deleteProducto = async (id) => {
  return await productoRepository.remove(id);
};
