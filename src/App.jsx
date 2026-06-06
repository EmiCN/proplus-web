import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import AdminLayout from './pages/admin/AdminLayout';
import AdministrativoLayout from './pages/administrativo/AdministrativoLayout';
import EmpleadoLayout from './pages/empleado/EmpleadoLayout';
import PoliciaLayout from './pages/policia/PoliciaLayout';

const AppRoutes = () => {
  const { usuario, cargando } = useAuth();

  if (cargando) return (
    <div className="flex items-center justify-center h-screen bg-principal">
      <div className="text-white text-xl">Cargando...</div>
    </div>
  );

  if (!usuario) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <Routes>
      {usuario.rol === 'administrador' && (
        <Route path="/*" element={<AdminLayout />} />
      )}
      {usuario.rol === 'administrativo' && (
        <Route path="/*" element={<AdministrativoLayout />} />
      )}
      {usuario.rol === 'empleado' && (
        <Route path="/*" element={<EmpleadoLayout />} />
      )}
      {usuario.rol === 'policia' && (
        <Route path="/*" element={<PoliciaLayout />} />
      )}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;