import { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminHistorial = () => {
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => { cargarHistorial(); }, []);

  const cargarHistorial = async () => {
    setCargando(true);
    try {
      const respuesta = await api.get('/qr/historial');
      setHistorial(respuesta.data);
    } catch (error) {
      alert('No se pudo cargar el historial');
    } finally {
      setCargando(false);
    }
  };

  if (cargando) return <div className="flex justify-center py-20 text-principal">Cargando historial...</div>;

  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-principal">Historial de accesos</h1>
        <button onClick={cargarHistorial}
          className="bg-principal text-white text-sm font-bold px-4 py-2 rounded-xl border-b-2 border-acento hover:opacity-90 transition">
          🔄 Actualizar
        </button>
      </div>

      {historial.length === 0 && (
        <div className="flex flex-col items-center py-20 text-gray-400">
          <span className="text-5xl mb-3">📋</span>
          <p>No hay registros de acceso aún</p>
        </div>
      )}

      <div className="space-y-3">
        {historial.map(item => (
          <div key={item.id} className={`bg-white rounded-2xl p-4 shadow-sm border-l-4 ${item.resultado === 'PERMITIDO' ? 'border-secundario' : 'border-red-500'}`}>
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold text-principal">{item.nombre} {item.apellido_paterno}</p>
              <span className={`text-xs font-bold px-2 py-1 rounded-full text-white ${item.resultado === 'PERMITIDO' ? 'bg-secundario' : 'bg-red-500'}`}>
                {item.resultado === 'PERMITIDO' ? '✓' : '✗'} {item.resultado}
              </span>
            </div>
            <p className="text-gray-400 text-xs">Nómina: {item.numero_nomina}</p>
            <p className="text-gray-400 text-xs">Puesto: {item.puesto || 'N/A'}</p>
            {item.motivo_rechazo && <p className="text-red-400 text-xs mt-1">Motivo: {item.motivo_rechazo}</p>}
            <p className="text-gray-300 text-xs mt-2">{new Date(item.fecha_acceso).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminHistorial;