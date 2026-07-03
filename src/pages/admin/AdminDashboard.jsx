import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const StatCard = ({ icono, titulo, valor, color }) => (
  <div className={`bg-white rounded-2xl p-4 shadow-sm border-l-4 ${color} flex items-center gap-4`}>
    <span className="text-4xl">{icono}</span>
    <div>
      <p className="text-gray-400 text-xs">{titulo}</p>
      <p className="text-2xl font-bold text-principal">{valor ?? '...'}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { usuario } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/qr/estadisticas').then(r => setStats(r.data)).catch(() => {});
  }, []);

  return (
    <div className="py-4">
      <div className="bg-principal text-white rounded-2xl p-5 mb-4 border-b-4 border-acento">
        <p className="text-white/70 text-sm">Bienvenido,</p>
        <h1 className="text-2xl font-bold">{usuario?.nombre} {usuario?.apellido_paterno}</h1>
        <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mt-2 uppercase">{usuario?.rol}</span>
        <p className="text-white/60 text-sm mt-1">Nómina: {usuario?.numero_nomina}</p>
      </div>

      <h2 className="font-bold text-principal text-lg mb-3">Resumen de hoy</h2>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatCard icono="🚪" titulo="Accesos hoy" valor={stats?.accesos_hoy} color="border-principal" />
        <StatCard icono="👥" titulo="Empleados activos" valor={stats?.empleados_activos} color="border-secundario" />
        <StatCard icono="✅" titulo="Permitidos hoy" valor={stats?.permitidos_hoy} color="border-secundario" />
        <StatCard icono="❌" titulo="Denegados hoy" valor={stats?.denegados_hoy} color="border-red-400" />
      </div>

      {stats?.ultimos_accesos?.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <h2 className="font-bold text-principal mb-3">Últimos accesos</h2>
          <div className="space-y-2">
            {stats.ultimos_accesos.map((a, i) => (
              <div key={i} className={`flex items-center justify-between p-2 rounded-xl ${a.resultado === 'PERMITIDO' ? 'bg-green-50' : 'bg-red-50'}`}>
                <div>
                  <p className="font-semibold text-principal text-sm">{a.nombre} {a.apellido_paterno}</p>
                  <p className="text-gray-400 text-xs">{a.numero_nomina}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full text-white ${a.resultado === 'PERMITIDO' ? 'bg-secundario' : 'bg-red-500'}`}>
                  {a.resultado === 'PERMITIDO' ? '✓' : '✗'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="font-bold text-principal text-lg mb-4">Acceso rápido</h2>
        {[
          { icono: '👥', texto: 'Gestiona usuarios desde "Usuarios"' },
          { icono: '🗂', texto: 'Administra las áreas en "Áreas"' },
          { icono: '🏢', texto: 'Gestiona los departamentos en "Deptos"' },
          { icono: '📥', texto: 'Importa usuarios masivamente en "Importar"' },
          { icono: '📋', texto: 'Revisa el historial en "Historial"' },
          { icono: '📱', texto: 'Genera tu QR de acceso en "Mi QR"' },
          { icono: '🔐', texto: 'Tienes acceso total al sistema' },
        ].map(({ icono, texto }) => (
          <div key={texto} className="flex items-start gap-3 mb-3">
            <span className="text-xl">{icono}</span>
            <p className="text-gray-500 text-sm leading-5">{texto}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;