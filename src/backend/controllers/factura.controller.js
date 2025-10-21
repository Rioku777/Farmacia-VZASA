import * as facturaService from '../services/factura.service.js';

export const getFacturas = async (req, res) => {
  try {
    const facturas = await facturaService.getFacturas();
    res.json(facturas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createFactura = async (req, res) => {
  try {
    const factura = await facturaService.createFactura(req.body);
    res.status(201).json(factura);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFactura = async (req, res) => {
  try {
    const factura = await facturaService.getFactura(parseInt(req.params.id));
    if (factura) {
      res.json(factura);
    } else {
      res.status(404).json({ message: 'Factura not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFactura = async (req, res) => {
  try {
    const factura = await facturaService.updateFactura(parseInt(req.params.id), req.body);
    res.json(factura);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFactura = async (req, res) => {
  try {
    await facturaService.deleteFactura(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
