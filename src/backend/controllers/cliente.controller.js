import * as clienteService from '../services/cliente.service.js';

export const getClientes = async (req, res, next) => {
  try {
    const clientes = await clienteService.getClientes();
    res.json(clientes);
  } catch (error) {
    next(error);
  }
};

export const createCliente = async (req, res, next) => {
  try {
    const cliente = await clienteService.createCliente(req.body);
    res.status(201).json(cliente);
  } catch (error) {
    next(error);
  }
};

export const getCliente = async (req, res, next) => {
  try {
    const cliente = await clienteService.getCliente(parseInt(req.params.id));
    if (cliente) {
      res.json(cliente);
    } else {
      res.status(404).json({ message: 'Cliente not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const updateCliente = async (req, res, next) => {
  try {
    const cliente = await clienteService.updateCliente(parseInt(req.params.id), req.body);
    res.json(cliente);
  } catch (error) {
    next(error);
  }
};

export const deleteCliente = async (req, res, next) => {
  try {
    await clienteService.deleteCliente(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
