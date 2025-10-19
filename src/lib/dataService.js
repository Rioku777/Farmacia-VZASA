
import React from 'react';

const initialData = {
  users: [
    { id: 1, username: 'admin', password: 'admin123', role: 'Administrador' },
    { id: 2, username: 'vendedor', password: 'vendedor123', role: 'Vendedor' }
  ],
  productos: [
    { id: 1, codigo: 'MED001', nombre: 'Paracetamol 500mg', proveedor: 'Farmacéutica Nacional', precio: 25.50, stock: 150, fechaVencimiento: '2025-12-31' },
    { id: 2, codigo: 'MED002', nombre: 'Ibuprofeno 400mg', proveedor: 'Laboratorios Unidos', precio: 35.00, stock: 80, fechaVencimiento: '2026-06-30' },
    { id: 3, codigo: 'MED003', nombre: 'Amoxicilina 500mg', proveedor: 'Farmacéutica Nacional', precio: 45.75, stock: 5, fechaVencimiento: '2025-12-15' },
    { id: 4, codigo: 'VIT001', nombre: 'Vitamina C 1000mg', proveedor: 'Suplenat', precio: 120.00, stock: 0, fechaVencimiento: '2026-01-31' },
  ],
  clientes: [
    { id: 1, nombre: 'María González', telefono: '8888-1234', email: 'maria@email.com', direccion: 'Nindirí Centro', notas: 'Cliente frecuente' }
  ],
  proveedores: [
    { id: 1, nombre: 'Farmacéutica Nacional', telefono: '2222-5678', email: 'ventas@farmanacional.com', direccion: 'Managua, Nicaragua', notas: 'Proveedor principal' },
    { id: 2, nombre: 'Laboratorios Unidos', telefono: '2233-4455', email: 'contacto@labunidos.com', direccion: 'Carretera Masaya', notas: '' }
  ],
  facturas: [],
  config: {
    nombreFarmacia: 'Farmacia V&ZASA',
    direccion: 'Nindirí, Nicaragua',
    telefono: '8888-0000',
    email: 'info@vzasa.com',
    iva: 15
  }
};

export const setupInitialData = () => {
  Object.keys(initialData).forEach(key => {
    if (!localStorage.getItem(`vzasa_${key}`)) {
      localStorage.setItem(`vzasa_${key}`, JSON.stringify(initialData[key]));
    }
  });
};

export const getData = (key) => {
  try {
    const data = localStorage.getItem(`vzasa_${key}`);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error getting data for key: ${key}`, error);
    return [];
  }
};

export const setData = (key, value) => {
  try {
    localStorage.setItem(`vzasa_${key}`, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting data for key: ${key}`, error);
  }
};

export const getAllData = () => {
  const allData = {};
  Object.keys(initialData).forEach(key => {
    allData[key] = getData(key);
  });
  return allData;
};
  