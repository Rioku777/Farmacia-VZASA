
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Download, Upload, Moon, Sun, Shield, Database, Edit, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { getData, setData, getAllData } from '@/lib/dataService';

const Configuracion = ({ currentUser, darkMode, toggleTheme, currentThemeColor, changeThemeColor }) => {
  const [config, setConfig] = useState({
    nombreFarmacia: 'Farmacia V&ZASA', direccion: '', telefono: '', email: '', iva: 15
  });

  useEffect(() => {
    const storedConfig = getData('config');
    if (Object.keys(storedConfig).length > 0) {
      setConfig(storedConfig);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setConfig(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
  };

  const guardarConfiguracion = () => {
    setData('config', config);
    toast({ title: "Configuración Guardada ✅", description: "Los cambios han sido guardados." });
  };

  const exportarDatos = () => {
    try {
      const allData = getAllData();
      const dataStr = JSON.stringify(allData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vzasa_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({ title: "Respaldo Creado ✅", description: "Todos los datos han sido exportados." });
    } catch (error) {
      toast({ title: "Error al Exportar ❌", description: "No se pudo crear el respaldo.", variant: "destructive" });
    }
  };

  const importarDatos = () => {
    toast({
      title: "Función no implementada 🚧",
      description: "La importación de datos estará disponible próximamente.",
    });
  };

  const colorThemes = [
    { id: 'default', label: 'Verde Azulado', color: '#007C84' },
    { id: 'purple', label: 'Violeta', color: '#7c3aed' },
    { id: 'blue', label: 'Azul Real', color: '#2563eb' },
    { id: 'orange', label: 'Naranja Fuego', color: '#ea580c' },
    { id: 'rose', label: 'Rosa Intenso', color: '#e11d48' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-white mb-2">Configuración y Ajustes</h1>
        <p className="text-gray-400">Personalice el sistema, gestione datos y apariencia.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-3 glass-card rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Shield className="w-6 h-6 text-[#007C84]" />Información de la Farmacia</h2>
          <div className="space-y-4">
            {[{name: 'nombreFarmacia', label: 'Nombre'}, {name: 'direccion', label: 'Dirección'}, {name: 'telefono', label: 'Teléfono'}, {name: 'email', label: 'Email', type: 'email'}, {name: 'iva', label: 'IVA (%)', type: 'number'}].map(field => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-300 mb-2">{field.label}</label>
                <input name={field.name} type={field.type || 'text'} value={config[field.name]} onChange={handleInputChange} className="w-full px-4 py-3 glass-input rounded-xl text-white focus:outline-none"/>
              </div>
            ))}
            <Button onClick={guardarConfiguracion} className="w-full glass-button text-white py-6 rounded-xl flex items-center justify-center gap-2 mt-4"><Save className="w-5 h-5" />Guardar Cambios</Button>
          </div>
        </motion.div>

        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Database className="w-6 h-6 text-[#007C84]" />Respaldo de Datos</h2>
            <div className="space-y-3">
              <Button onClick={exportarDatos} className="w-full glass-button text-white py-6 rounded-xl flex items-center justify-center gap-2"><Download className="w-5 h-5" />Exportar Respaldo</Button>
              <Button onClick={importarDatos} className="w-full glass-card hover:bg-white/10 text-white py-6 rounded-xl flex items-center justify-center gap-2"><Upload className="w-5 h-5" />Importar Respaldo</Button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Palette className="w-6 h-6 text-[#007C84]" />Apariencia</h2>

            <div className="mb-4">
               <label className="block text-sm font-medium text-gray-300 mb-3">Color del Tema</label>
               <div className="grid grid-cols-5 gap-2">
                 {colorThemes.map((theme) => (
                   <button
                     key={theme.id}
                     onClick={() => changeThemeColor(theme.id)}
                     className={`w-full aspect-square rounded-full transition-all duration-300 ${currentThemeColor === theme.id ? 'ring-2 ring-white scale-110' : 'hover:scale-105 opacity-70 hover:opacity-100'}`}
                     style={{ backgroundColor: theme.color }}
                     title={theme.label}
                   />
                 ))}
               </div>
               <p className="text-center text-sm text-gray-400 mt-2">{colorThemes.find(t => t.id === currentThemeColor)?.label}</p>
            </div>

            <div className="flex items-center justify-between glass-card p-4 rounded-xl">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="w-6 h-6 text-[#007C84]" /> : <Sun className="w-6 h-6 text-[#007C84]" />}
                <p className="text-white font-medium">Modo {darkMode ? 'Oscuro' : 'Claro'}</p>
              </div>
              <button onClick={toggleTheme} className={`relative w-14 h-8 rounded-full transition-colors ${darkMode ? 'bg-[#007C84]' : 'bg-gray-600'}`}>
                <motion.div animate={{ x: darkMode ? 28 : 4 }} transition={{ type: 'spring', stiffness: 500, damping: 25 }} className="absolute top-1 left-0 w-6 h-6 bg-white rounded-full shadow-lg" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Configuracion;
