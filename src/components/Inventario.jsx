
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Package, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import * as api from '@/lib/apiService';

const Inventario = ({ currentUser }) => {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '', descripcion: '', forma: 'Unidad', precio: 0, stock: 0, proveedorId: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      const [productosData, proveedoresData] = await Promise.all([
        api.get('productos'),
        api.get('proveedores'),
      ]);
      setProductos(productosData);
      setProveedores(proveedoresData);
    };
    fetchData();
  }, []);

  const abrirModal = (producto = null) => {
    if (producto) {
      setProductoEditando(producto);
      const proveedorNombre = producto.proveedor ? producto.proveedor.nombre : '';
      setFormData({ ...producto, proveedor: proveedorNombre, forma: producto.forma || 'Unidad' });
    } else {
      setProductoEditando(null);
      setFormData({ nombre: '', descripcion: '', forma: 'Unidad', precio: 0, stock: 0, proveedor: '' });
    }
    setMostrarModal(true);
  };

  const cerrarModal = () => setMostrarModal(false);

  const guardarProducto = async () => {
    if (!formData.nombre || !formData.precio || !formData.stock) {
      toast({ title: "Error ❌", description: "Nombre, precio y stock son obligatorios.", variant: "destructive" });
      return;
    }

    const proveedor = proveedores.find(p => p.nombre === formData.proveedor);
    if (!proveedor) {
      toast({ title: "Error ❌", description: "Proveedor no encontrado.", variant: "destructive" });
      return;
    }

    const productoData = {
      nombre: formData.nombre,
      descripcion: formData.descripcion || '',
      forma: formData.forma || 'Unidad',
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock),
      proveedorId: proveedor.id,
    };

    try {
      if (productoEditando) {
        const actualizado = await api.update('productos', productoEditando.id, productoData);
        setProductos(productos.map(p => p.id === productoEditando.id ? actualizado : p));
        toast({ title: "Producto Actualizado ✅", description: `${formData.nombre} ha sido actualizado.` });
      } else {
        const nuevo = await api.create('productos', productoData);
        setProductos([...productos, nuevo]);
        toast({ title: "Producto Agregado ✅", description: `${formData.nombre} ha sido agregado al inventario.` });
      }
      cerrarModal();
    } catch (error) {
      toast({ title: "Error ❌", description: "No se pudo guardar el producto.", variant: "destructive" });
    }
  };

  const eliminarProducto = async (id) => {
    if (currentUser.role !== 'Administrador') {
      toast({ title: "Acceso Denegado 🚫", description: "Solo los administradores pueden eliminar productos.", variant: "destructive"});
      return;
    }
    try {
      await api.remove('productos', id);
      const productosActualizados = productos.filter(p => p.id !== id);
      setProductos(productosActualizados);
      toast({ title: "Producto Eliminado 🗑️", description: "El producto ha sido eliminado del inventario." });
    } catch (error) {
      toast({ title: "Error ❌", description: "No se pudo eliminar el producto.", variant: "destructive" });
    }
  };

  const getStockStatusColor = (stock) => {
    if (stock === 0) return 'text-red-500';
    if (stock < 10) return 'text-yellow-500';
    return 'text-green-500';
  };

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (p.proveedor && p.proveedor.nombre.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Gestión de Inventario</h1>
            <p className="text-gray-400">Administre los productos, stock y precios de su farmacia.</p>
          </div>
          <Button onClick={() => abrirModal()} className="glass-button text-white px-6 py-6 rounded-xl flex items-center gap-2">
            <Plus className="w-5 h-5" />Nuevo Producto
          </Button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
        <div className="mb-6"><div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="Buscar por nombre, código o proveedor..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="w-full pl-12 pr-4 py-3 glass-input rounded-xl text-white focus:outline-none"/></div></div>
        <div className="overflow-auto"><table className="w-full text-left">
          <thead><tr className="border-b border-white/10"><th className="p-3 text-gray-400 font-medium">Nombre</th><th className="p-3 text-gray-400 font-medium">Forma</th><th className="p-3 text-gray-400 font-medium">Proveedor</th><th className="p-3 text-gray-400 font-medium text-right">Precio</th><th className="p-3 text-gray-400 font-medium text-center">Stock</th><th className="p-3 text-gray-400 font-medium text-right">Acciones</th></tr></thead>
          <tbody>
            {productosFiltrados.map((producto) => (
              <motion.tr key={producto.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-3"><p className="text-white font-medium">{producto.nombre}</p></td>
                <td className="p-3 text-gray-400">{producto.forma}</td>
                <td className="p-3 text-gray-400">{producto.proveedor ? producto.proveedor.nombre : 'N/A'}</td>
                <td className="p-3 text-[#00a8b4] font-semibold text-right">C$ {producto.precio.toFixed(2)}</td>
                <td className="p-3 text-center"><span className={`font-bold text-lg ${getStockStatusColor(producto.stock)}`}>{producto.stock}</span></td>
                <td className="p-3"><div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => abrirModal(producto)} className="hover:bg-blue-500/20 text-blue-400"><Edit2 className="w-4 h-4" /></Button>
                  {currentUser.role === 'Administrador' && <Button variant="ghost" size="icon" onClick={() => eliminarProducto(producto.id)} className="hover:bg-red-500/20 text-red-400"><Trash2 className="w-4 h-4" /></Button>}
                </div></td>
              </motion.tr>
            ))}
          </tbody>
        </table>{productosFiltrados.length === 0 && <div className="text-center py-12"><Package className="w-16 h-16 text-gray-600 mx-auto mb-4" /><p className="text-gray-400">No se encontraron productos. ¡Agregue el primero!</p></div>}</div>
      </motion.div>

      <AnimatePresence>{mostrarModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={cerrarModal}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="glass-card rounded-2xl p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">{productoEditando ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="Nombre del producto *" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="w-full px-4 py-3 glass-input rounded-xl text-white focus:outline-none md:col-span-2"/>
              <input placeholder="Descripción" value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} className="w-full px-4 py-3 glass-input rounded-xl text-white focus:outline-none md:col-span-2"/>

              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                <input placeholder="Forma (ej. Pastillas, Jarabe)" value={formData.forma} onChange={(e) => setFormData({ ...formData, forma: e.target.value })} className="w-full px-4 py-3 glass-input rounded-xl text-white focus:outline-none"/>
                <input placeholder="Proveedor" value={formData.proveedor} onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })} className="w-full px-4 py-3 glass-input rounded-xl text-white focus:outline-none"/>
              </div>

              <input type="number" placeholder="Precio (C$) *" value={formData.precio} onChange={(e) => setFormData({ ...formData, precio: e.target.value })} className="w-full px-4 py-3 glass-input rounded-xl text-white focus:outline-none"/>
              <input type="number" placeholder="Stock *" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="w-full px-4 py-3 glass-input rounded-xl text-white focus:outline-none"/>
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={cerrarModal} className="flex-1 glass-card hover:bg-white/10 text-white py-6 rounded-xl">Cancelar</Button>
              <Button onClick={guardarProducto} className="flex-1 glass-button text-white py-6 rounded-xl">{productoEditando ? 'Actualizar' : 'Guardar'}</Button>
            </div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>
    </div>
  );
};

export default Inventario;
  