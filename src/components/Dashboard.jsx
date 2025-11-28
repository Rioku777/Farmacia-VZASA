
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Package, AlertTriangle, FileText, DollarSign, Users, AlertCircle } from 'lucide-react';
import * as api from '@/lib/apiService';

const Dashboard = ({ currentUser }) => {
  const [stats, setStats] = useState({
    ventasHoy: 0,
    productosStock: 0,
    alertasVencimiento: 0,
    facturasEmitidas: 0,
    totalVentas: 0,
    clientesActivos: 0
  });
  const [actividad, setActividad] = useState([]);
  const [productosBajoStock, setProductosBajoStock] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [facturas, productos, clientes] = await Promise.all([
          api.get('facturas').catch(() => []),
          api.get('productos').catch(() => []),
          api.get('clientes').catch(() => [])
        ]);

        const hoy = new Date().toDateString();
        const facturasHoy = facturas.filter(f => new Date(f.fecha).toDateString() === hoy);
        const ventasHoy = facturasHoy.reduce((sum, f) => sum + f.total, 0);

        const productosEnStock = productos.filter(p => p.stock > 0).length;
        const bajoStock = productos.filter(p => p.stock <= 10).sort((a, b) => a.stock - b.stock);
        setProductosBajoStock(bajoStock);

        // Note: Backend might not return expiration dates yet, but we keep logic just in case
        const alertas = productos.filter(p => {
          if (!p.fechaVencimiento) return false;
          const fechaVencimiento = new Date(p.fechaVencimiento);
          const diasRestantes = Math.ceil((fechaVencimiento - new Date()) / (1000 * 60 * 60 * 24));
          return diasRestantes <= 30 && diasRestantes >= 0;
        }).length;

        const totalVentas = facturas.reduce((sum, f) => sum + f.total, 0);

        setStats({
          ventasHoy,
          productosStock: productosEnStock,
          alertasVencimiento: alertas,
          facturasEmitidas: facturas.length,
          totalVentas,
          clientesActivos: clientes.length
        });

        setActividad(facturas.slice(-3).reverse());
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      title: 'Ventas del Día',
      value: `C$ ${stats.ventasHoy.toFixed(2)}`,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Productos en Stock',
      value: stats.productosStock,
      icon: Package,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      title: 'Productos Bajo Stock',
      value: productosBajoStock.length,
      icon: AlertCircle,
      color: 'from-red-500 to-rose-600',
    },
    {
      title: 'Facturas Emitidas',
      value: stats.facturasEmitidas,
      icon: FileText,
      color: 'from-purple-500 to-pink-600',
    },
    {
      title: 'Total Ventas',
      value: `C$ ${stats.totalVentas.toFixed(2)}`,
      icon: TrendingUp,
      color: 'from-teal-500 to-cyan-600',
    },
    {
      title: 'Clientes Activos',
      value: stats.clientesActivos,
      icon: Users,
      color: 'from-indigo-500 to-blue-600',
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Bienvenido de vuelta, {currentUser.username} 👋</h1>
        <p className="text-gray-400">Aquí tienes un resumen de la actividad de tu farmacia.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="glass-card rounded-2xl p-6 relative overflow-hidden"
          >
            <div className={`absolute -top-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br ${stat.color} opacity-10 blur-xl`}></div>
            <div className="relative z-10">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} inline-block mb-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-gray-400 text-sm mb-2">{stat.title}</h3>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">⚠️ Alertas de Stock Bajo</h2>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {productosBajoStock.length > 0 ? productosBajoStock.map((prod, index) => (
              <motion.div
                key={prod.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-3 rounded-xl flex items-center justify-between hover:bg-white/5 transition-all"
              >
                <div>
                  <p className="text-white font-medium">{prod.nombre}</p>
                  <p className="text-xs text-gray-400">{prod.proveedor ? prod.proveedor.nombre : 'Sin proveedor'}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${prod.stock === 0 ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    Stock: {prod.stock}
                  </span>
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-green-500/50 mx-auto mb-2" />
                <p className="text-green-400">Todo el inventario está saludable.</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">Actividad Reciente</h2>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {actividad.length > 0 ? actividad.map((factura, index) => (
              <motion.div
                key={factura.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-4 rounded-xl flex items-center gap-4 hover:bg-white/5 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#007C84] to-[#00a8b4] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Factura #{factura.id}</p>
                  <p className="text-sm text-gray-400">{new Date(factura.fecha).toLocaleDateString()}</p>
                </div>
                <p className="text-[#00a8b4] font-semibold text-lg">C$ {factura.total.toFixed(2)}</p>
              </motion.div>
            )) : (
              <p className="text-center text-gray-500 py-8">No hay actividad reciente para mostrar.</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
  