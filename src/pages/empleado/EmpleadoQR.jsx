import { useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const EmpleadoQR = () => {
  const [qr, setQr] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [segundos, setSegundos] = useState(0);
  const { usuario } = useAuth();
  let intervalo = null;

  const generarQR = async () => {
    setCargando(true);
    setQr(null);
    try {
      const respuesta = await api.get('/qr/generar');
      setQr(respuesta.data.qr);
      setSegundos(60);
      intervalo = setInterval(() => {
        setSegundos(prev => {
          if (prev <= 1) {
            clearInterval(intervalo);
            setQr(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      alert(error.response?.data?.mensaje || 'No se pudo generar el QR');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="py-4 flex flex-col items-center">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 w-full mb-4">
        <h2 className="font-bold text-principal text-lg mb-1">{usuario?.nombre} {usuario?.apellido_paterno}</h2>
        <p className="text-gray-400 text-sm">Nómina: {usuario?.numero_nomina}</p>
        <p className="text-gray-400 text-sm">Puesto: {usuario?.puesto || 'No asignado'}</p>
        <p className="text-gray-400 text-sm">Departamento: {usuario?.departamento || 'No asignado'}</p>
        <span className="inline-block bg-principal text-white text-xs font-bold px-3 py-1 rounded-full mt-2 uppercase">
          {usuario?.rol}
        </span>
      </div>

      {qr && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 w-full mb-4 flex flex-col items-center">
          <img src={qr} alt="QR Code" className="w-56 h-56 mb-3" />
          <span className={`font-bold text-lg px-4 py-2 rounded-full text-white ${segundos > 20 ? 'bg-secundario' : 'bg-red-500'}`}>
            ⏱ Expira en {segundos}s
          </span>
          <p className="text-gray-400 text-xs mt-2 text-center">⚠️ No compartas este código con nadie</p>
        </div>
      )}

      <button
        onClick={generarQR}
        disabled={cargando}
        className="w-full bg-principal text-white font-bold py-4 rounded-2xl border-b-4 border-acento hover:opacity-90 transition disabled:opacity-50 text-lg"
      >
        {cargando ? 'Generando...' : qr ? '🔄 Generar nuevo QR' : '📱 Generar QR de acceso'}
      </button>
    </div>
  );
};

export default EmpleadoQR;