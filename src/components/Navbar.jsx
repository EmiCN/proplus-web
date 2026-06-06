import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';
import logoPng from '../assets/logo_proplus.png';

const Navbar = ({ links }) => {
  const { usuario, logout } = useAuth();

  return (
    <div className="bg-principal text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="bg-black rounded-xl p-2 border-b-2 border-acento">
            <img src={logoPng} alt="ProPlus" className="h-6 w-auto" />
          </div>
          <div>
            <p className="font-bold text-sm">ProPlus</p>
            <p className="text-white/60 text-xs">Control de Acceso</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold">{usuario?.nombre} {usuario?.apellido_paterno}</p>
            <p className="text-white/60 text-xs capitalize">{usuario?.rol}</p>
          </div>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
          >
            Salir
          </button>
        </div>
      </div>

      {/* Nav tabs */}
      <div className="flex overflow-x-auto border-b border-white/20">
        {links.map(({ to, icono, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center px-4 py-2 text-xs font-semibold whitespace-nowrap transition min-w-[64px] ${
                isActive ? 'bg-white/20 border-b-2 border-acento' : 'hover:bg-white/10'
              }`
            }
          >
            <span className="text-lg">{icono}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Navbar;