import { useState, useRef } from 'react';
import api from '../../services/api';

const PoliciaScanner = () => {
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [escaneando, setEscaneando] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const iniciarCamara = async () => {
    try {
      setResultado(null);
      setEscaneando(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      escanearFrame();
    } catch (error) {
      alert('No se pudo acceder a la cámara. Verifica los permisos.');
      setEscaneando(false);
    }
  };

  const detenerCamara = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setEscaneando(false);
  };

  const escanearFrame = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const tick = async () => {
      if (!videoRef.current || !escaneando) return;
      if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        if (window.jsQR) {
          const code = window.jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
            detenerCamara();
            await validarQR(code.data);
            return;
          }
        }
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
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
          onClick={iniciarCamara}
          className="w-full bg-principal text-white font-bold py-8 rounded-2xl border-b-4 border-acento hover:opacity-90 transition mb-4 flex flex-col items-center gap-2"
        >
          <span className="text-5xl">📷</span>
          <span className="text-lg">Escanear QR de acceso</span>
        </button>
      )}

      {escaneando && (
        <div className="mb-4">
          <video ref={videoRef} className="w-full rounded-2xl" autoPlay playsInline muted />
          <button
            onClick={detenerCamara}
            className="w-full mt-2 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition"
          >
            Cancelar
          </button>
        </div>
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
            onClick={iniciarCamara}
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