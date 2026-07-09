import { useState, useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import api from '../../services/api';

const AdminScanner = () => {
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [escaneando, setEscaneando] = useState(false);
  const videoRef = useRef(null);
  const lectorRef = useRef(null);

  useEffect(() => {
    lectorRef.current = new BrowserMultiFormatReader();
    return () => { if (lectorRef.current) lectorRef.current.reset(); };
  }, []);

  const iniciarEscaneo = async () => {
    setResultado(null);
    setEscaneando(true);
    try {
      await lectorRef.current.decodeFromVideoDevice(
        null, videoRef.current,
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
    if (respuesta.data.acceso) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 1000;
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
      } catch {}
    } else {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.value = 300;
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
      } catch {}
    }
  } catch (error) {
    setResultado({ acceso: false, mensaje: error.response?.data?.mensaje || 'Error al validar QR' });
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.value = 300;
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    } catch {}
  } finally {
    setCargando(false);
  }
};

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold text-principal mb-1">Lector QR</h1>
      <p className="text-gray-400 text-sm mb-4">Escanea el código QR del empleado</p>

      {!escaneando && !cargando && !resultado && (
        <button onClick={iniciarEscaneo}
          className="w-full bg-principal text-white font-bold py-8 rounded-2xl border-b-4 border-acento hover:opacity-90 transition mb-4 flex flex-col items-center gap-2">
          <span className="text-5xl">📷</span>
          <span className="text-lg">Escanear QR de acceso</span>
        </button>
      )}

      <video ref={videoRef} className={`w-full rounded-2xl mb-2 ${escaneando ? 'block' : 'hidden'}`} autoPlay playsInline muted />

      {escaneando && (
        <button onClick={detenerEscaneo}
          className="w-full bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition mb-4">
          Cancelar
        </button>
      )}

      {cargando && <div className="text-center py-8 text-gray-400">Validando acceso...</div>}

      {/* Modal resultado */}
      {resultado && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          
          {/* CONTENEDOR PRINCIPAL DEL MODAL */}
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">

            {/* Header con color según resultado */}
            <div className={`p-5 flex items-center gap-3 shrink-0 ${resultado.acceso ? 'bg-secundario' : 'bg-red-500'}`}>
              <span className="text-4xl">{resultado.acceso ? '✅' : '❌'}</span>
              <div>
                <h2 className="text-white font-bold text-xl">
                  {resultado.acceso ? 'ACCESO PERMITIDO' : 'ACCESO DENEGADO'}
                </h2>
                {!resultado.acceso && <p className="text-white/80 text-sm">{resultado.mensaje}</p>}
              </div>
            </div>

            {/* CUERPO DEL MODAL (Con scroll interno) */}
            <div className="overflow-y-auto">
              {resultado?.acceso && resultado?.empleado && (
                <div className="mb-4">
                  
                  {/* SECCIÓN DE LA FOTO MODIFICADA */}
                  {resultado.empleado.foto_url ? (
                    <img 
                      src={resultado.empleado.foto_url} 
                      className="w-full aspect-[3/4] object-cover bg-gray-100"
                      alt={`Foto de ${resultado.empleado.nombre}`} 
                    />
                  ) : (
                    <div className="w-full aspect-[3/4] bg-principal flex items-center justify-center text-white text-6xl font-bold">
                      {resultado.empleado.nombre?.[0] || '?'}{resultado.empleado.apellido_paterno?.[0] || ''}
                    </div>
                  )}
                  
                  {/* SECCIÓN DE NOMBRE Y ROL */}
                  <div className="p-4">
                    <h3 className="font-bold text-principal text-lg leading-tight">
                      {resultado.empleado.nombre} {resultado.empleado.apellido_paterno} {resultado.empleado.apellido_materno}
                    </h3>
                    <span className="inline-block bg-principal text-white text-xs font-bold px-2 py-0.5 rounded-full mt-1 uppercase">
                      {resultado.empleado.rol}
                    </span>
                  </div>

                  {/* SECCIÓN DE DETALLES */}
                  <div className="px-4 pb-2">
                    <div className="space-y-3">
                      {[
                        { label: 'Número de nómina', valor: resultado.empleado.numero_nomina },
                        { label: 'Puesto', valor: resultado.empleado.puesto || 'No asignado' },
                        { label: 'Departamento', valor: resultado.empleado.departamento || 'No asignado' },
                      ].map(({ label, valor }) => (
                        <div key={label} className="flex justify-between items-center border-b border-gray-100 pb-2">
                          <span className="text-gray-400 text-sm">{label}</span>
                          <span className="font-semibold text-principal text-sm text-right">{valor}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* PIE DEL MODAL: BOTONES */}
            <div className="p-5 flex gap-3 shrink-0 bg-white border-t border-gray-50">
              <button onClick={iniciarEscaneo}
                className="flex-1 bg-principal text-white font-bold py-3 rounded-xl border-b-2 border-acento hover:opacity-90 transition">
                📷 Escanear otro
              </button>
              <button onClick={() => setResultado(null)}
                className="flex-1 border border-gray-200 text-gray-500 font-bold py-3 rounded-xl hover:bg-gray-50 transition">
                Cerrar
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminScanner;