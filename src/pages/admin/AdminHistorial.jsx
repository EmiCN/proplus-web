import { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminHistorial = () => {
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  useEffect(() => { cargarHistorial(); }, []);

  const cargarHistorial = async () => {
    setCargando(true);
    try {
      const params = new URLSearchParams();
      if (busqueda) params.append('busqueda', busqueda);
      if (fechaInicio) params.append('fecha_inicio', fechaInicio);
      if (fechaFin) params.append('fecha_fin', fechaFin);
      const respuesta = await api.get(`/qr/historial-filtrado?${params.toString()}`);
      setHistorial(respuesta.data);
    } catch (error) {
      alert('No se pudo cargar el historial');
    } finally {
      setCargando(false);
    }
  };

  const limpiarFiltros = () => {
    setBusqueda('');
    setFechaInicio('');
    setFechaFin('');
    setTimeout(() => cargarHistorial(), 100);
  };

  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-principal">Historial</h1>
        <button onClick={cargarHistorial}
          className="bg-principal text-white text-sm font-bold px-4 py-2 rounded-xl border-b-2 border-acento hover:opacity-90 transition">
          🔄 Buscar
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm mb-4 space-y-3">
        <input
          className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-principal"
          placeholder="Buscar por nombre o nómina..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && cargarHistorial()}
        />
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs text-gray-400 mb-1 block">Desde</label>
            <input type="date" className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-principal"
              value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-400 mb-1 block">Hasta</label>
            <input type="date" className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-principal"
              value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
          </div>
        </div>
        <button onClick={limpiarFiltros}
          className="w-full border border-gray-200 text-gray-400 text-sm py-2 rounded-xl hover:bg-gray-50 transition">
          Limpiar filtros
        </button>
      </div>

      {cargando ? (
        <div className="flex justify-center py-20 text-principal">Cargando...</div>
      ) : (
        <>
          <p className="text-gray-400 text-xs mb-3">{historial.length} registros encontrados</p>
          <div className="space-y-3">
            {historial.length === 0 && (
              <div className="flex flex-col items-center py-20 text-gray-400">
                <span className="text-5xl mb-3">📋</span>
                <p>No hay registros que coincidan</p>
              </div>
            )}
            {historial.map(item => (
              <div key={item.id} className={`bg-white rounded-2xl p-4 shadow-sm border-l-4 ${item.resultado === 'PERMITIDO' ? 'border-secundario' : 'border-red-500'}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-principal">{item.nombre} {item.apellido_paterno}</p>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full text-white ${item.resultado === 'PERMITIDO' ? 'bg-secundario' : 'bg-red-500'}`}>
                    {item.resultado === 'PERMITIDO' ? '✓' : '✗'} {item.resultado}
                  </span>
                </div>
                <p className="text-gray-400 text-xs">Nómina: {item.numero_nomina}</p>
                <p className="text-gray-400 text-xs">Puesto: {item.puesto || 'N/A'} — Depto: {item.departamento || 'N/A'}</p>
                {item.motivo_rechazo && <p className="text-red-400 text-xs mt-1">Motivo: {item.motivo_rechazo}</p>}
                <p className="text-gray-300 text-xs mt-2">{new Date(item.fecha_acceso).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminHistorial;