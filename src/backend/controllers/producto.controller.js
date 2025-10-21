import * as productoService from '../services/producto.service.js';

export const getProductos = async (req, res) => {
  try {
    const productos = await productoService.getProductos();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProducto = async (req, res) => {
  try {
    const producto = await productoService.createProducto(req.body);
    res.status(201).json(producto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProducto = async (req, res) => {
  try {
    const producto = await productoService.getProducto(parseInt(req.params.id));
    if (producto) {
      res.json(producto);
    } else {
      res.status(404).json({ message: 'Producto not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProducto = async (req, res) => {
  try {
    const producto = await productoService.updateProducto(parseInt(req.params.id), req.body);
    res.json(producto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProducto = async (req, res) => {
  try {
    await productoService.deleteProducto(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
