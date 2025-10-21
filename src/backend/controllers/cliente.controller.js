import * as clienteService from '../services/cliente.service.js';

export const getClientes = async (req, res) => {
  try {
    const clientes = await clienteService.getClientes();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCliente = async (req, res) => {
  try {
    const cliente = await clienteService.createCliente(req.body);
    res.status(201).json(cliente);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCliente = async (req, res) => {
  try {
    const cliente = await clienteService.getCliente(parseInt(req.params.id));
    if (cliente) {
      res.json(cliente);
    } else {
      res.status(404).json({ message: 'Cliente not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCliente = async (req, res) => {
  try {
    const cliente = await clienteService.updateCliente(parseInt(req.params.id), req.body);
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCliente = async (req, res) => {
  try {
    await clienteService.deleteCliente(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
