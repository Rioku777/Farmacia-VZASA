import * as facturaRepository from '../repositories/factura.repository.js';

export const getFacturas = async () => {
  return await facturaRepository.findMany();
};

export const createFactura = async (factura) => {
  return await facturaRepository.create(factura);
};

export const getFactura = async (id) => {
  return await facturaRepository.findUnique(id);
};

export const updateFactura = async (id, factura) => {
  return await facturaRepository.update(id, factura);
};

export const deleteFactura = async (id) => {
  return await facturaRepository.remove(id);
};
