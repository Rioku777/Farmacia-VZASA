import * as proveedorService from '../services/proveedor.service.js';

export const getProveedores = async (req, res, next) => {
  try {
    const proveedores = await proveedorService.getProveedores();
    res.json(proveedores);
  } catch (error) {
    next(error);
  }
};

export const createProveedor = async (req, res, next) => {
  try {
    const proveedor = await proveedorService.createProveedor(req.body);
    res.status(201).json(proveedor);
  } catch (error) {
    next(error);
  }
};

export const getProveedor = async (req, res, next) => {
  try {
    const proveedor = await proveedorService.getProveedor(parseInt(req.params.id));
    if (proveedor) {
      res.json(proveedor);
    } else {
      res.status(404).json({ message: 'Proveedor not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const updateProveedor = async (req, res, next) => {
  try {
    const proveedor = await proveedorService.updateProveedor(parseInt(req.params.id), req.body);
    res.json(proveedor);
  } catch (error) {
    next(error);
  }
};

export const deleteProveedor = async (req, res, next) => {
  try {
    await proveedorService.deleteProveedor(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
