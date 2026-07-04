import logoPng from '../assets/logo_proplus.png';

const TarjetaQR = ({ usuario, qr }) => {
  return (
    <div className="tarjeta-imprimir bg-white rounded-2xl w-64 mx-auto flex flex-col items-center border-2 border-principal overflow-hidden">
      <div className="bg-principal w-full flex items-center justify-center py-3 border-b-4 border-acento">
        <img src={logoPng} alt="ProPlus" className="h-7 w-auto" style={{ filter: 'brightness(0) invert(1)' }} />
      </div>
      <div className="p-4 flex flex-col items-center">
        <img src={qr.qr} alt="QR" className="w-48 h-48 mb-3" />
        <div className="text-center border-t border-gray-100 pt-3 w-full">
          <p className="text-gray-400 text-xs mb-1">Número de nómina</p>
          <p className="font-bold text-principal text-lg">{usuario.numero_nomina}</p>
        </div>
      </div>
      <div className="bg-gray-50 w-full text-center py-2 border-t border-gray-100">
        <p className="text-gray-400 text-xs font-semibold">Control de Acceso</p>
      </div>
    </div>
  );
};

export default TarjetaQR;