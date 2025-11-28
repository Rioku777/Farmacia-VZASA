
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, FileText, Search, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { getProducts, getClients, getInvoices, createInvoice } from '@/lib/dataService';

const Facturacion = ({ currentUser }) => {
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [facturaItems, setFacturaItems] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [historialFacturas, setHistorialFacturas] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  const loadData = async () => {
    try {
      const [prodData, cliData, invData] = await Promise.all([
        getProducts(),
        getClients(),
        getInvoices()
      ]);
      setProductos(prodData);
      setClientes(cliData);
      setHistorialFacturas(invData);
    } catch(err) {
      console.error(err);
      toast({ title: "Error", description: "Error al cargar datos", variant: "destructive" });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const agregarItem = () => {
    if (!productoSeleccionado || cantidad <= 0) {
      toast({ title: "Error ❌", description: "Seleccione un producto y cantidad válida", variant: "destructive" });
      return;
    }

    const producto = productos.find(p => p.id === parseInt(productoSeleccionado));
    if (!producto) return;

    if (producto.stock < cantidad) {
      toast({ title: "Stock insuficiente ⚠️", description: `Solo hay ${producto.stock} unidades de ${producto.nombre}.`, variant: "destructive" });
      return;
    }

    const itemExistente = facturaItems.find(item => item.id === producto.id);
    if (itemExistente) {
      setFacturaItems(facturaItems.map(item =>
        item.id === producto.id ? { ...item, cantidad: item.cantidad + cantidad, subtotal: (item.cantidad + cantidad) * item.precio } : item
      ));
    } else {
      setFacturaItems([...facturaItems, { id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: cantidad, subtotal: producto.precio * cantidad }]);
    }
    setProductoSeleccionado('');
    setCantidad(1);
    toast({ title: "Producto agregado ✅", description: `${producto.nombre} x${cantidad}` });
  };

  const eliminarItem = (id) => {
    setFacturaItems(facturaItems.filter(item => item.id !== id));
    toast({ title: "Producto eliminado 🗑️", description: "Item removido de la factura." });
  };

  const calcularTotales = () => {
    const subtotal = facturaItems.reduce((sum, item) => sum + item.subtotal, 0);
    const iva = subtotal * 0.15;
    const total = subtotal + iva;
    return { subtotal, iva, total };
  };

  const generarFactura = async () => {
    if (facturaItems.length === 0) {
      toast({ title: "Error ❌", description: "Agregue productos para generar la factura.", variant: "destructive" });
      return;
    }

    const { subtotal, iva, total } = calcularTotales();
    const nuevaFactura = {
      numero: `F-${Date.now().toString().slice(-6)}`,
      fecha: new Date().toISOString(),
      cliente: clienteSeleccionado ? clientes.find(c => c.id === parseInt(clienteSeleccionado))?.nombre : 'Cliente General',
      items: facturaItems,
      subtotal, iva, total,
      usuario: currentUser.username
    };

    try {
        const result = await createInvoice(nuevaFactura);
        toast({ title: "¡Factura generada! 🎉", description: `Factura ${result.numero} creada exitosamente.` });
        setFacturaItems([]);
        setClienteSeleccionado('');
        await loadData();
    } catch(err) {
        toast({ title: "Error ❌", description: err.message, variant: "destructive" });
    }
  };

  const { subtotal, iva, total } = calcularTotales();
  const facturasFiltradas = historialFacturas.filter(f =>
    f.numero.toLowerCase().includes(busqueda.toLowerCase()) || f.cliente.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-white mb-2">Punto de Venta</h1>
        <p className="text-gray-400">Genere facturas y gestione las ventas del día.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-3 glass-card rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Nueva Factura</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Cliente (Opcional)</label>
              <select value={clienteSeleccionado} onChange={(e) => setClienteSeleccionado(e.target.value)} className="w-full px-4 py-3 glass-input rounded-xl text-white focus:outline-none">
                <option value="">Cliente General</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Producto</label>
                <select value={productoSeleccionado} onChange={(e) => setProductoSeleccionado(e.target.value)} className="w-full px-4 py-3 glass-input rounded-xl text-white focus:outline-none">
                  <option value="">Seleccionar producto...</option>
                  {productos.filter(p => p.stock > 0).map(p => <option key={p.id} value={p.id}>{p.nombre} {p.forma ? `(${p.forma})` : ''} (Stock: {p.stock})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cantidad</label>
                <input type="number" min="1" value={cantidad} onChange={(e) => setCantidad(parseInt(e.target.value) || 1)} className="w-full px-4 py-3 glass-input rounded-xl text-white focus:outline-none text-center"/>
              </div>
            </div>
            <Button onClick={agregarItem} className="w-full glass-button text-white py-6 rounded-xl flex items-center justify-center gap-2"><Plus className="w-5 h-5" />Agregar Producto</Button>
          </div>
          <div className="mt-6 space-y-3">
            <h3 className="text-lg font-semibold text-white">Productos en Factura</h3>
            <div className="max-h-48 overflow-y-auto pr-2 space-y-2">
            {facturaItems.length === 0 ? <p className="text-gray-400 text-center py-8">No hay productos agregados</p> :
              facturaItems.map(item => (
                <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{item.nombre}</p>
                    <p className="text-sm text-gray-400">C$ {item.precio.toFixed(2)} x {item.cantidad} = C$ {item.subtotal.toFixed(2)}</p>
                  </div>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => eliminarItem(item.id)} className="p-2 rounded-full hover:bg-red-500/20 text-red-400 transition-all"><Trash2 className="w-5 h-5" /></motion.button>
                </motion.div>
              ))}
            </div>
          </div>
          {facturaItems.length > 0 && (
            <div className="mt-6 glass-card p-4 rounded-xl space-y-2 border border-teal-500/20">
              <div className="flex justify-between text-gray-300"><span>Subtotal:</span><span>C$ {subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-300"><span>IVA (15%):</span><span>C$ {iva.toFixed(2)}</span></div>
              <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-white/10"><span>Total:</span><span className="text-[#00a8b4]">C$ {total.toFixed(2)}</span></div>
            </div>
          )}
          <Button onClick={generarFactura} disabled={facturaItems.length === 0} className="w-full glass-button text-white py-6 rounded-xl mt-6 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"><FileText className="w-5 h-5" />Generar Factura</Button>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Historial de Facturas</h2>
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="pl-10 pr-4 py-2 glass-input rounded-xl text-white focus:outline-none w-full"/></div>
          </div>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {facturasFiltradas.length === 0 ? <p className="text-gray-400 text-center py-8">No hay facturas registradas</p> :
              [...facturasFiltradas].reverse().map(factura => (
                <motion.div key={factura.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.01 }} className="glass-card p-4 rounded-xl hover:bg-white/5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-white font-semibold">{factura.numero}</p>
                      <p className="text-sm text-gray-400 flex items-center gap-1"><User className="w-3 h-3"/>{factura.cliente}</p>
                    </div>
                    <p className="text-[#00a8b4] font-bold text-lg">C$ {factura.total.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(factura.fecha).toLocaleDateString()}</span>
                    <span>por: {factura.usuario}</span>
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Facturacion;
  