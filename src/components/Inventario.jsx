
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Package, AlertCircle, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import * as api from '@/lib/apiService';

const Inventario = ({ currentUser }) => {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);

  // State for "Forma" handling
  const [formaManual, setFormaManual] = useState('');

  // Common pharmaceutical forms
  const formasFarmaceuticas = [
    'Tableta', 'Cápsula', 'Jarabe', 'Suspensión', 'Inyección',
    'Crema', 'Ungüento', 'Gotas', 'Supositorio', 'Óvulo',
    'Polvo', 'Gel', 'Spray', 'Unidad', 'Otro'
  ];

  const [formData, setFormData] = useState({
    nombre: '', descripcion: '', forma: 'Tableta', precio: 0, stock: 0, proveedorId: ''
  });

  const [productoExistenteSeleccionado, setProductoExistenteSeleccionado] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productosData, proveedoresData] = await Promise.all([
          api.get('productos'),
          api.get('proveedores'),
        ]);
        setProductos(productosData || []);
        setProveedores(proveedoresData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const abrirModal = (producto = null) => {
    setProductoExistenteSeleccionado('');
    if (producto) {
      setProductoEditando(producto);
      const formaEsComun = formasFarmaceuticas.includes(producto.forma);
      setFormData({
        ...producto,
        proveedorId: producto.proveedorId || '',
        forma: formaEsComun ? producto.forma : 'Otro'
      });
      if (!formaEsComun) setFormaManual(producto.forma);
    } else {
      setProductoEditando(null);
      setFormData({
        nombre: '', descripcion: '', forma: 'Tableta', precio: 0, stock: 0, proveedorId: ''
      });
      setFormaManual('');
    }
    setMostrarModal(true);
  };

  const cerrarModal = () => setMostrarModal(false);

  // Handle selecting an existing product to pre-fill the form
  const handleProductoExistenteChange = (e) => {
    const id = parseInt(e.target.value);
    setProductoExistenteSeleccionado(id);

    const producto = productos.find(p => p.id === id);
    if (producto) {
      // Pre-fill form but keep it as "New" (or Edit mode if intended, but usually user wants to add stock)
      // Here we will just fill the data to facilitate cloning or updating.
      // If the user wants to strictly "Update Stock", they should probably use the Edit button on the list.
      // But let's assume this feature is for "I want to create a product like this one" or "Oops, it exists, let me edit it".
      // Let's switch to Edit mode for safety if it matches exactly.

      setProductoEditando(producto);
      const formaEsComun = formasFarmaceuticas.includes(producto.forma);
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        forma: formaEsComun ? producto.forma : 'Otro',
        precio: producto.precio,
        stock: producto.stock, // Show current stock
        proveedorId: producto.proveedorId
      });
      if (!formaEsComun) setFormaManual(producto.forma);

      toast({ title: "Datos cargados 📋", description: "Puede editar el stock o precio." });
    }
  };

  const guardarProducto = async () => {
    if (!formData.nombre || !formData.precio || !formData.stock) {
      toast({ title: "Error ❌", description: "Nombre, precio y stock son obligatorios.", variant: "destructive" });
      return;
    }

    if (!formData.proveedorId) {
      toast({ title: "Error ❌", description: "Debe seleccionar un proveedor.", variant: "destructive" });
      return;
    }

    const formaFinal = formData.forma === 'Otro' ? formaManual : formData.forma;
    if (!formaFinal) {
       toast({ title: "Error ❌", description: "Especifique la forma farmacéutica.", variant: "destructive" });
       return;
    }

    const productoData = {
      nombre: formData.nombre,
      descripcion: formData.descripcion || '',
      forma: formaFinal,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock),
      proveedorId: parseInt(formData.proveedorId),
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
      console.error(error);
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
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="glass-card rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">{productoEditando ? 'Editar Producto' : 'Nuevo Producto'}</h2>

            {/* Auto-fill from existing */}
            {!productoEditando && (
              <div className="mb-6 p-4 rounded-xl border border-white/10 bg-white/5">
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2"><Copy className="w-4 h-4"/> Cargar datos de existente (Opcional)</label>
                <select
                  value={productoExistenteSeleccionado}
                  onChange={handleProductoExistenteChange}
                  className="w-full px-4 py-3 glass-input rounded-xl text-white focus:outline-none"
                >
                  <option value="">Seleccionar para autocompletar...</option>
                  {productos.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre} - {p.forma}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Nombre Comercial</label>
                <input placeholder="Ej. Acetaminofén MK" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="w-full px-4 py-3 glass-input rounded-xl text-white focus:outline-none"/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Descripción (Opcional)</label>
                <input placeholder="Ej. Caja con 10 sobres" value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} className="w-full px-4 py-3 glass-input rounded-xl text-white focus:outline-none"/>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Forma Farmacéutica</label>
                  <select value={formData.forma} onChange={(e) => setFormData({ ...formData, forma: e.target.value })} className="w-full px-4 py-3 glass-input rounded-xl text-white focus:outline-none">
                    {formasFarmaceuticas.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>

                {formData.forma === 'Otro' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Especifique Forma</label>
                    <input placeholder="Especifique..." value={formaManual} onChange={(e) => setFormaManual(e.target.value)} className="w-full px-4 py-3 glass-input rounded-xl text-white focus:outline-none"/>
                  </motion.div>
                )}

                <div>
                   <label className="block text-sm font-medium text-gray-300 mb-1">Proveedor</label>
                   <select value={formData.proveedorId} onChange={(e) => setFormData({ ...formData, proveedorId: e.target.value })} className="w-full px-4 py-3 glass-input rounded-xl text-white focus:outline-none">
                    <option value="">Seleccionar Proveedor...</option>
                    {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                   </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Precio (C$)</label>
                  <input type="number" min="0" step="0.01" value={formData.precio} onChange={(e) => setFormData({ ...formData, precio: e.target.value })} className="w-full px-4 py-3 glass-input rounded-xl text-white focus:outline-none"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Stock Inicial</label>
                  <input type="number" min="0" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="w-full px-4 py-3 glass-input rounded-xl text-white focus:outline-none"/>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <Button onClick={cerrarModal} className="flex-1 glass-card hover:bg-white/10 text-white py-4 rounded-xl">Cancelar</Button>
              <Button onClick={guardarProducto} className="flex-1 glass-button text-white py-4 rounded-xl">{productoEditando ? 'Actualizar Producto' : 'Guardar Producto'}</Button>
            </div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>
    </div>
  );
};

export default Inventario;
