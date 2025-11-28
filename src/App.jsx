
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';
import Facturacion from '@/components/Facturacion';
import Inventario from '@/components/Inventario';
import ClientesProveedores from '@/components/ClientesProveedores';
import Reportes from '@/components/Reportes';
import Configuracion from '@/components/Configuracion';
import { Toaster } from '@/components/ui/toaster';
import { LayoutDashboard, Receipt, Package, Users, BarChart3, Settings, LogOut, Briefcase } from 'lucide-react';

const BackgroundOrbs = () => (
  <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-[-1]">
    <div className="orb orb-1"></div>
    <div className="orb orb-2"></div>
    <div className="orb orb-3"></div>
  </div>
);

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const [currentThemeColor, setCurrentThemeColor] = useState('default');

  useEffect(() => {
    const savedUser = localStorage.getItem('vzasa_current_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    const savedDarkMode = localStorage.getItem('vzasa_darkmode');
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === 'true');
    }

    const savedThemeColor = localStorage.getItem('vzasa_theme_color');
    if (savedThemeColor) {
      setCurrentThemeColor(savedThemeColor);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // Remove all theme classes first
    document.body.classList.remove('theme-purple', 'theme-blue', 'theme-orange', 'theme-rose');

    // Add current theme class if not default
    if (currentThemeColor !== 'default') {
      document.body.classList.add(`theme-${currentThemeColor}`);
    }
  }, [currentThemeColor]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('vzasa_current_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('vzasa_current_user');
    setCurrentView('dashboard');
  };

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('vzasa_darkmode', newMode.toString());
  };

  const changeThemeColor = (colorId) => {
    setCurrentThemeColor(colorId);
    localStorage.setItem('vzasa_theme_color', colorId);
  };
  
  const mainContent = (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentView}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {currentView === 'dashboard' && <Dashboard currentUser={currentUser} />}
        {currentView === 'facturacion' && <Facturacion currentUser={currentUser} />}
        {currentView === 'inventario' && <Inventario currentUser={currentUser} />}
        {currentView === 'clientes' && <ClientesProveedores currentUser={currentUser} />}
        {currentView === 'reportes' && <Reportes currentUser={currentUser} />}
        {currentView === 'configuracion' && (
          <Configuracion
            currentUser={currentUser}
            darkMode={darkMode}
            toggleTheme={toggleTheme}
            currentThemeColor={currentThemeColor}
            changeThemeColor={changeThemeColor}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );

  return (
    <div className="main-background min-h-screen transition-colors duration-500">
      <BackgroundOrbs />
      {!currentUser ? (
        <>
          <Helmet>
            <title>Login - Sistema V&ZASA</title>
            <meta name="description" content="Sistema Local de Facturación e Inventario - Farmacia V&ZASA" />
          </Helmet>
          <Login onLogin={handleLogin} darkMode={darkMode} toggleTheme={toggleTheme} />
        </>
      ) : (
        <>
          <Helmet>
            <title>Sistema V&ZASA - {currentView.charAt(0).toUpperCase() + currentView.slice(1)}</title>
            <meta name="description" content="Sistema Local de Facturación e Inventario - Farmacia V&ZASA, Nindirí, Nicaragua" />
          </Helmet>
          <div className="flex h-screen overflow-hidden">
            <Sidebar 
              currentView={currentView} 
              setCurrentView={setCurrentView}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
            <main className="flex-1 p-6 overflow-y-auto">
              {mainContent}
            </main>
          </div>
        </>
      )}
      <Toaster />
    </div>
  );
}

function Sidebar({ currentView, setCurrentView, currentUser, onLogout }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'facturacion', label: 'Facturación', icon: Receipt },
    { id: 'inventario', label: 'Inventario', icon: Package },
    { id: 'clientes', label: 'Clientes/Proveedores', icon: Users },
    { id: 'reportes', label: 'Reportes', icon: BarChart3 },
    { id: 'configuracion', label: 'Configuración', icon: Settings },
  ];

  return (
    <motion.aside
      initial={{ x: -288 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 50, damping: 15 }}
      className="w-72 glass-card m-4 rounded-3xl p-6 flex flex-col shrink-0"
    >
      <div className="mb-8 text-center">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="w-28 h-28 mx-auto mb-4 rounded-2xl glass-card flex items-center justify-center pulse-glow border border-primary-20"
        >
          <span className="text-5xl font-bold text-primary">V&Z</span>
        </motion.div>
        <h2 className="text-xl font-bold text-white">Farmacia V&ZASA</h2>
        <p className="text-sm text-gray-400 mt-1">Nindirí, Nicaragua</p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-4 relative ${
              currentView === item.id
                ? 'glass-button text-white font-semibold'
                : 'text-gray-300 hover:bg-white/5'
            }`}
            whileHover={{ scale: 1.03, x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            {currentView === item.id && (
              <motion.div
                layoutId="sidebar-active-indicator"
                className="absolute left-0 top-0 h-full w-1 bg-white/50 rounded-r-full"
              />
            )}
            <item.icon className="w-5 h-5 shrink-0" />
            <span className="font-medium">{item.label}</span>
          </motion.button>
        ))}
      </nav>

      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="glass-card p-4 rounded-xl mb-4">
          <p className="text-sm text-gray-400">Usuario activo</p>
          <p className="font-semibold text-white truncate">{currentUser.username}</p>
          <p className="text-xs text-primary font-medium mt-1 flex items-center gap-1">
            <Briefcase className="w-3 h-3" />
            {currentUser.role}
          </p>
        </div>
        <motion.button
          onClick={onLogout}
          className="w-full px-4 py-3 rounded-xl glass-card hover:bg-red-500/20 text-gray-300 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </motion.button>
      </div>
    </motion.aside>
  );
}

export default App;
