
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Users, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { getData, setData } from '@/lib/dataService';

const ClientesProveedores = ({ currentUser }) => {
  const [vista, setVista] = useState('clientes');
  const [items, setItems] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', telefono: '', email: '', direccion: '', notas: '' });

  useEffect(() => {
    setItems(getData(vista));
    setBusqueda('');
  }, [vista]);

  const abrirModal = (item = null) => {
    setEditando(item);
    setFormData(item || { nombre: '', telefono: '', email: '', direccion: '', notas: '' });
    setMostrarModal(true);
  };
  
  const cerrarModal = () => setMostrarModal(false);

  const guardar = () => {
    if (!formData.nombre) {
      toast({ title: "Error ❌", description: "El nombre es obligatorio.", variant: "destructive" });
      return;
    }
    
    let listaActualizada;
    if (editando) {
      listaActualizada = items.map(item => item.id === editando.id ? { ...formData, id: item.id } : item);
      toast({ title: "Actualizado ✅", description: `${formData.nombre} ha sido actualizado.` });
    } else {
      listaActualizada = [...items, { ...formData, id: Date.now() }];
      toast({ title: "Agregado ✅", description: `${formData.nombre} ha sido agregado.` });
    }
    
    setData(vista, listaActualizada);
    setItems(listaActualizada);
    cerrarModal();
  };

  const eliminar = (id) => {
    const listaActualizada = items.filter(item => item.id !== id);
    setData(vista, listaActualizada);
    setItems(listaActualizada);
    toast({ title: "Eliminado 🗑️", description: "El registro ha sido eliminado." });
  };

  const listaFiltrada = items.filter(item =>
    item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (item.telefono && item.telefono.includes(busqueda)) ||
    (item.email && item.email.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Contactos</h1>
            <p className="text-gray-400">Gestione su red de clientes y proveedores.</p>
          </div>
          <Button onClick={() => abrirModal()} className="glass-button text-white px-6 py-6 rounded-xl flex items-center gap-2"><Plus className="w-5 h-5" />Nuevo {vista === 'clientes' ? 'Cliente' : 'Proveedor'}</Button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
        <div className="flex gap-4 mb-6 glass-card p-2 rounded-xl">
          <button onClick={() => setVista('clientes')} className={`flex-1 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${vista === 'clientes' ? 'glass-button text-white' : 'text-gray-400 hover:bg-white/5'}`}><Users className="w-5 h-5" />Clientes</button>
          <button onClick={() => setVista('proveedores')} className={`flex-1 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${vista === 'proveedores' ? 'glass-button text-white' : 'text-gray-400 hover:bg-white/5'}`}><Building className="w-5 h-5" />Proveedores</button>
        </div>
        <div className="mb-6"><div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="Buscar por nombre, teléfono o email..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="w-full pl-12 pr-4 py-3 glass-input rounded-xl text-white focus:outline-none"/></div></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listaFiltrada.map((item) => (
            <motion.div key={item.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ y: -5 }} className="glass-card p-5 rounded-xl flex flex-col">
              <div className="flex-1 mb-3">
                <h3 className="text-lg font-bold text-white mb-2">{item.nombre}</h3>
                {item.telefono && <p className="text-sm text-gray-400 flex items-center gap-2 mb-1">📞 {item.telefono}</p>}
                {item.email && <p className="text-sm text-gray-400 flex items-center gap-2 mb-1">✉️ {item.email}</p>}
                {item.direccion && <p className="text-sm text-gray-400 flex items-center gap-2 mb-1">📍 {item.direccion}</p>}
              </div>
              <div className="flex gap-2 pt-3 border-t border-white/10">
                <Button variant="ghost" size="sm" onClick={() => abrirModal(item)} className="w-full hover:bg-blue-500/20 text-blue-400"><Edit2 className="w-4 h-4 mr-1" />Editar</Button>
                <Button variant="ghost" size="sm" onClick={() => eliminar(item.id)} className="w-full hover:bg-red-500/20 text-red-400"><Trash2 className="w-4 h-4 mr-1" />Eliminar</Button>
              </div>
            </motion.div>
          ))}
        </div>
        {listaFiltrada.length === 0 && <div className="text-center py-12">{vista === 'clientes' ? <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" /> : <Building className="w-16 h-16 text-gray-600 mx-auto mb-4" />}<p className="text-gray-400">No se encontraron registros.</p></div>}
      </motion.div>

      <AnimatePresence>{mostrarModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={cerrarModal}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="glass-card rounded-2xl p-6 w-full max-w-lg">
            <h2 className="text-2xl font-bold text-white mb-6">{editando ? 'Editar' : 'Nuevo'} {vista === 'clientes' ? 'Cliente' : 'Proveedor'}</h2>
            <div className="space-y-4">
              <input placeholder="Nombre *" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="w-full px-4 py-3 glass-input rounded-xl text-white focus:outline-none"/>
              <input placeholder="Teléfono" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} className="w-full px-4 py-3 glass-input rounded-xl text-white focus:outline-none"/>
              <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 glass-input rounded-xl text-white focus:outline-none"/>
              <input placeholder="Dirección" value={formData.direccion} onChange={(e) => setFormData({ ...formData, direccion: e.target.value })} className="w-full px-4 py-3 glass-input rounded-xl text-white focus:outline-none"/>
              <textarea placeholder="Notas adicionales..." value={formData.notas} onChange={(e) => setFormData({ ...formData, notas: e.target.value })} className="w-full px-4 py-3 glass-input rounded-xl text-white focus:outline-none resize-none" rows="3"/>
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={cerrarModal} className="flex-1 glass-card hover:bg-white/10 text-white py-6 rounded-xl">Cancelar</Button>
              <Button onClick={guardar} className="flex-1 glass-button text-white py-6 rounded-xl">{editando ? 'Actualizar' : 'Guardar'}</Button>
            </div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>
    </div>
  );
};

export default ClientesProveedores;
  