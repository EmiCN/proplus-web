import logoPng from '../assets/logo_proplus.png';

const TarjetaQR = ({ usuario, qr }) => {
  return (
    <div className="tarjeta-imprimir bg-white border-2 border-principal rounded-2xl p-6 w-80 mx-auto">
      <div className="flex items-center justify-center mb-4">
        <div className="bg-black rounded-xl p-2">
          <img src={logoPng} alt="ProPlus" className="h-6 w-auto" />
        </div>
      </div>

      <div className="flex flex-col items-center mb-4">
        <img src={qr.qr} alt="QR" className="w-48 h-48 mb-3" />
      </div>

      <div className="text-center border-t border-gray-200 pt-3">
        <p className="font-bold text-principal text-lg">{usuario.nombre} {usuario.apellido_paterno}</p>
        <p className="text-gray-500 text-sm">Nómina: {usuario.numero_nomina}</p>
        <p className="text-gray-500 text-sm">{usuario.puesto || 'N/A'}</p>
        <p className="text-gray-500 text-sm">{usuario.departamento || 'N/A'}</p>
      </div>

      <div className="text-center mt-3">
        <span className="bg-secundario text-white text-xs font-bold px-3 py-1 rounded-full">
          Control de Acceso
        </span>
      </div>
    </div>
  );
};

export default TarjetaQR;