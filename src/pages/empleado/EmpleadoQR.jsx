import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const EmpleadoQR = () => {
  const [qr, setQr] = useState(null);
  const [cargando, setCargando] = useState(true);
  const { usuario } = useAuth();

  useEffect(() => {
    generarQR();
  }, []);

  const generarQR = async () => {
    setCargando(true);
    try {
      const respuesta = await api.get('/qr/generar');
      setQr(respuesta.data.qr);
    } catch (error) {
      alert(error.response?.data?.mensaje || 'No se pudo cargar el QR');
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

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 w-full mb-4 flex flex-col items-center min-h-[260px] justify-center">
        {cargando ? (
          <div className="text-principal">Cargando QR...</div>
        ) : qr ? (
          <>
            <img src={qr} alt="QR Code" className="w-56 h-56 mb-3" />
            <span className="font-bold text-sm px-4 py-2 rounded-full text-white bg-secundario">
              ✓ Código permanente
            </span>
            <p className="text-gray-400 text-xs mt-2 text-center">Este es tu código de acceso, preséntalo en la entrada</p>
          </>
        ) : (
          <p className="text-red-500">No se pudo cargar el QR</p>
        )}
      </div>
    </div>
  );
};

export default EmpleadoQR;