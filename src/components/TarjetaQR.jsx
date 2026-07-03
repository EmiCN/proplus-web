import logoPng from '../assets/logo_proplus.png';

const TarjetaQR = ({ usuario, qr }) => {
  return (
    <div className="tarjeta-imprimir bg-white rounded-2xl p-6 w-72 mx-auto flex flex-col items-center border border-gray-100">
      <img src={logoPng} alt="ProPlus" className="h-8 w-auto mb-4" />
      <img src={qr.qr} alt="QR" className="w-56 h-56 mb-4" />
      <p className="font-bold text-principal text-center text-base">{usuario.numero_nomina}</p>
      <p className="text-gray-400 text-xs text-center mt-1">Control de Acceso</p>
    </div>
  );
};

export default TarjetaQR;