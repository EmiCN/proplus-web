import { useState, useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import api from '../../services/api';

const PoliciaScanner = () => {
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [escaneando, setEscaneando] = useState(false);
  const videoRef = useRef(null);
  const lectorRef = useRef(null);

  useEffect(() => {
    lectorRef.current = new BrowserMultiFormatReader();
    return () => {
      if (lectorRef.current) lectorRef.current.reset();
    };
  }, []);

  const iniciarEscaneo = async () => {
    setResultado(null);
    setEscaneando(true);
    try {
      await lectorRef.current.decodeFromVideoDevice(
        null,
        videoRef.current,
        async (result, error) => {
          if (result) {
            lectorRef.current.reset();
            setEscaneando(false);
            await validarQR(result.getText());
          }
        }
      );
    } catch (error) {
      alert('No se pudo acceder a la cámara. Verifica los permisos.');
      setEscaneando(false);
    }
  };

  const detenerEscaneo = () => {
    if (lectorRef.current) lectorRef.current.reset();
    setEscaneando(false);
  };

  const validarQR = async (token) => {
    setCargando(true);
    try {
      const respuesta = await api.post('/qr/validar', { token });
      setResultado(respuesta.data);
    } catch (error) {
      setResultado({
        acceso: false,
        mensaje: error.response?.data?.mensaje || 'Error al validar QR'
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold text-principal mb-1">Control de entrada</h1>
      <p className="text-gray-400 text-sm mb-4">Escanea el código QR del empleado</p>

      {!escaneando && !cargando && (
        <button
          onClick={iniciarEscaneo}
          className="w-full bg-principal text-white font-bold py-8 rounded-2xl border-b-4 border-acento hover:opacity-90 transition mb-4 flex flex-col items-center gap-2"
        >
          <span className="text-5xl">📷</span>
          <span className="text-lg">Escanear QR de acceso</span>
        </button>
      )}

      <video
        ref={videoRef}
        className={`w-full rounded-2xl mb-2 ${escaneando ? 'block' : 'hidden'}`}
        autoPlay
        playsInline
        muted
      />

      {escaneando && (
        <button
          onClick={detenerEscaneo}
          className="w-full bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition mb-4"
        >
          Cancelar
        </button>
      )}

      {cargando && (
        <div className="text-center py-8 text-gray-400">Validando acceso...</div>
      )}

      {resultado && (
        <div className={`rounded-2xl p-5 mb-4 border-l-4 ${resultado.acceso ? 'bg-green-50 border-secundario' : 'bg-red-50 border-red-500'}`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{resultado.acceso ? '✅' : '❌'}</span>
            <h2 className={`text-xl font-bold ${resultado.acceso ? 'text-secundario' : 'text-red-500'}`}>
              {resultado.acceso ? 'ACCESO PERMITIDO' : 'ACCESO DENEGADO'}
            </h2>
          </div>
          {resultado.acceso && resultado.empleado && (
            <div className="bg-white rounded-xl p-3 mb-3">
              <p className="font-bold text-principal">{resultado.empleado.nombre} {resultado.empleado.apellido_paterno}</p>
              <p className="text-gray-400 text-sm">Puesto: {resultado.empleado.puesto || 'N/A'}</p>
              <p className="text-gray-400 text-sm">Departamento: {resultado.empleado.departamento || 'N/A'}</p>
            </div>
          )}
          {!resultado.acceso && (
            <p className="text-red-500 text-sm mb-3">{resultado.mensaje}</p>
          )}
          <button
            onClick={iniciarEscaneo}
            className="w-full bg-principal text-white font-bold py-3 rounded-xl border-b-2 border-acento hover:opacity-90 transition"
          >
            📷 Escanear otro
          </button>
        </div>
      )}
    </div>
  );
};

export default PoliciaScanner;