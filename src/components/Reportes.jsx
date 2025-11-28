
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Calendar, Download, DollarSign, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { getInvoices } from '@/lib/dataService';

const Reportes = ({ currentUser }) => {
  const [periodo, setPeriodo] = useState('semana');
  const [facturas, setFacturas] = useState([]);

  useEffect(() => {
    getInvoices().then(setFacturas).catch(console.error);
  }, []);

  const estadisticas = useMemo(() => {
    const ahora = new Date();
    let facturasFiltradas = facturas;

    if (periodo !== 'todo') {
      facturasFiltradas = facturas.filter(f => {
        const fechaFactura = new Date(f.fecha);
        if (periodo === 'hoy') return fechaFactura.toDateString() === ahora.toDateString();
        if (periodo === 'semana') {
          const inicioSemana = new Date(ahora);
          inicioSemana.setDate(ahora.getDate() - 7);
          return fechaFactura >= inicioSemana;
        }
        if (periodo === 'mes') return fechaFactura.getMonth() === ahora.getMonth() && fechaFactura.getFullYear() === ahora.getFullYear();
        return true;
      });
    }

    const totalVentas = facturasFiltradas.reduce((sum, f) => sum + f.total, 0);
    const cantidadFacturas = facturasFiltradas.length;
    const promedioVenta = cantidadFacturas > 0 ? totalVentas / cantidadFacturas : 0;
    const productosContador = {};
    facturasFiltradas.forEach(f => f.items.forEach(item => {
      productosContador[item.nombre] = (productosContador[item.nombre] || 0) + item.cantidad;
    }));
    const productosMasVendidos = Object.entries(productosContador).sort((a, b) => b[1] - a[1]).slice(0, 5);

    return { totalVentas, cantidadFacturas, promedioVenta, productosMasVendidos };
  }, [facturas, periodo]);

  const datosGrafica = useMemo(() => {
    const dias = Array.from({ length: 7 }, (_, i) => {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() - i);
      const ventasDia = facturas
        .filter(f => new Date(f.fecha).toDateString() === fecha.toDateString())
        .reduce((sum, f) => sum + f.total, 0);
      return { dia: fecha.toLocaleDateString('es-NI', { weekday: 'short' }), ventas: ventasDia };
    }).reverse();
    return dias;
  }, [facturas]);
  
  const maxVentaGrafica = Math.max(...datosGrafica.map(d => d.ventas), 1);

  const exportarReporte = () => {
    toast({
      title: "Función no implementada 🚧",
      description: "La exportación de reportes estará disponible próximamente.",
    });
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Análisis de Desempeño</h1>
            <p className="text-gray-400">Visualice las métricas clave de su negocio.</p>
          </div>
          <Button onClick={exportarReporte} className="glass-button text-white px-6 py-6 rounded-xl flex items-center gap-2"><Download className="w-5 h-5" />Exportar PDF</Button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
        <div className="flex gap-2 mb-6 glass-card p-2 rounded-xl">
          {[{ id: 'hoy', label: 'Hoy' }, { id: 'semana', label: '7 Días' }, { id: 'mes', label: 'Mes' }, { id: 'todo', label: 'Total' }].map(p => (
            <button key={p.id} onClick={() => setPeriodo(p.id)} className={`flex-1 py-3 rounded-lg font-semibold transition-all ${periodo === p.id ? 'glass-button text-white' : 'text-gray-400 hover:bg-white/5'}`}>{p.label}</button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[ { icon: DollarSign, title: 'Total Ventas', value: `C$ ${estadisticas.totalVentas.toFixed(2)}` }, { icon: BarChart3, title: 'Facturas Emitidas', value: estadisticas.cantidadFacturas }, { icon: TrendingUp, title: 'Promedio por Venta', value: `C$ ${estadisticas.promedioVenta.toFixed(2)}` } ].map((stat, i) => (
            <motion.div key={i} whileHover={{ y: -5 }} className="glass-card p-6 rounded-xl">
              <stat.icon className="w-8 h-8 text-[#00a8b4] mb-3" />
              <p className="text-gray-400 text-sm">{stat.title}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-6">Ventas de los Últimos 7 Días</h3>
            <div className="flex justify-between items-end h-48 gap-2">
              {datosGrafica.map((dia, index) => (
                <motion.div key={index} className="w-full flex flex-col items-center justify-end h-full" title={`C$ ${dia.ventas.toFixed(2)}`}>
                  <motion.div initial={{ height: 0 }} animate={{ height: `${(dia.ventas / maxVentaGrafica) * 100}%` }} transition={{ duration: 0.5, delay: index * 0.05 }} className="w-4/5 bg-gradient-to-t from-[#007C84] to-[#00a8b4] rounded-t-md hover:opacity-80"/>
                  <p className="text-xs text-gray-400 mt-2 capitalize">{dia.dia}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-6">Top 5 Productos Vendidos</h3>
            <div className="space-y-3">
              {estadisticas.productosMasVendidos.length > 0 ? estadisticas.productosMasVendidos.map(([nombre, cantidad], index) => (
                <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="glass-card p-3 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#007C84]/50 to-[#00a8b4]/50 flex items-center justify-center text-white font-bold">{index + 1}</div>
                    <p className="text-white font-medium">{nombre}</p>
                  </div>
                  <p className="text-gray-300 font-semibold">{cantidad} <span className="text-gray-400 text-sm">unid.</span></p>
                </motion.div>
              )) : <p className="text-gray-400 text-center py-8">No hay datos disponibles para este periodo.</p>}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Reportes;
  