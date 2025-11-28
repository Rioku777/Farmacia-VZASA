
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Moon, Sun, User, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { login } from '@/lib/dataService';

const Login = ({ onLogin, darkMode, toggleTheme }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const user = await login(username, password);
      toast({
        title: "¡Bienvenido de vuelta! 🎉",
        description: `Acceso concedido como ${user.role}.`,
        className: 'glass-card text-white border-[#007C84]',
      });
      onLogin(user);
    } catch(err) {
      toast({
        title: "Error de Acceso ❌",
        description: "Usuario o contraseña incorrectos. Por favor, intente de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <motion.button
        onClick={toggleTheme}
        className="absolute top-6 right-6 glass-card p-3 rounded-full hover:bg-white/10 transition-all"
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
      >
        {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-purple-400" />}
      </motion.button>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="glass-card rounded-3xl p-8 md:p-12 w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 mx-auto mb-6 rounded-2xl glass-card flex items-center justify-center pulse-glow border border-[#007C84]/50"
          >
            <span className="text-5xl font-bold text-[#00a8b4]">V&Z</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Farmacia V&ZASA</h1>
          <p className="text-gray-400">Sistema de Facturación e Inventario</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Usuario
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 pl-12 glass-input rounded-xl text-white placeholder-gray-500 focus:outline-none"
                placeholder="Ingrese su usuario"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pl-12 glass-input rounded-xl text-white placeholder-gray-500 focus:outline-none pr-12"
                placeholder="Ingrese su contraseña"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#007C84] transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              className="w-full glass-button text-white font-semibold py-6 rounded-xl text-lg"
            >
              Iniciar Sesión
            </Button>
          </motion.div>
        </form>

        <div className="mt-8 p-4 glass-card rounded-xl border border-teal-500/20">
          <p className="text-xs text-gray-400 text-center mb-2">Usuarios de prueba:</p>
          <p className="text-xs text-gray-300 text-center">👤 <span className="font-mono">admin</span> / <span className="font-mono">admin123</span> (Administrador)</p>
          <p className="text-xs text-gray-300 text-center">👤 <span className="font-mono">vendedor</span> / <span className="font-mono">vendedor123</span> (Vendedor)</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
  