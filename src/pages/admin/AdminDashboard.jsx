import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { usuario } = useAuth();

  return (
    <div className="py-4">
      <div className="bg-principal text-white rounded-2xl p-5 mb-4 border-b-4 border-acento">
        <p className="text-white/70 text-sm">Bienvenido,</p>
        <h1 className="text-2xl font-bold">{usuario?.nombre} {usuario?.apellido_paterno}</h1>
        <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mt-2 uppercase">
          {usuario?.rol}
        </span>
        <p className="text-white/60 text-sm mt-1">Nómina: {usuario?.numero_nomina}</p>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="font-bold text-principal text-lg mb-4">Acceso rápido</h2>
        {[
          { icono: '👥', texto: 'Gestiona usuarios desde "Usuarios"' },
          { icono: '🗂', texto: 'Administra las áreas en "Áreas"' },
          { icono: '🏢', texto: 'Gestiona los departamentos en "Deptos"' },
          { icono: '📥', texto: 'Importa usuarios masivamente en "Importar"' },
          { icono: '📋', texto: 'Revisa el historial en "Historial"' },
          { icono: '📱', texto: 'Genera tu QR de acceso en "Mi QR"' },
          { icono: '🔐', texto: 'Tienes acceso total al sistema' },
        ].map(({ icono, texto }) => (
          <div key={texto} className="flex items-start gap-3 mb-3">
            <span className="text-xl">{icono}</span>
            <p className="text-gray-500 text-sm leading-5">{texto}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;