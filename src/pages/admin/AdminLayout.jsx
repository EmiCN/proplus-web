import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import AdminDashboard from './AdminDashboard';
import AdminUsuarios from './AdminUsuarios';
import AdminPuestos from './AdminPuestos';
import AdminDepartamentos from './AdminDepartamentos';
import AdminHistorial from './AdminHistorial';
import AdminCargaMasiva from './AdminCargaMasiva';
import EmpleadoQR from '../empleado/EmpleadoQR';
import AdminScanner from './AdminScanner';

const links = [
  { to: '/dashboard', icono: '🏠', label: 'Inicio' },
  { to: '/usuarios', icono: '👥', label: 'Usuarios' },
  { to: '/puestos', icono: '🗂', label: 'Áreas' },
  { to: '/departamentos', icono: '🏢', label: 'Deptos' },
  { to: '/importar', icono: '📥', label: 'Importar' },
  { to: '/historial', icono: '📋', label: 'Historial' },
  { to: '/mi-qr', icono: '📱', label: 'Mi QR' },
  { to: '/scanner', icono: '📷', label: 'Scanner' },
];

const AdminLayout = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <Navbar links={links} />
    <div className="flex-1 p-4 max-w-4xl mx-auto w-full">
      <Routes>
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/usuarios" element={<AdminUsuarios />} />
        <Route path="/puestos" element={<AdminPuestos />} />
        <Route path="/departamentos" element={<AdminDepartamentos />} />
        <Route path="/importar" element={<AdminCargaMasiva />} />
        <Route path="/historial" element={<AdminHistorial />} />
        <Route path="/mi-qr" element={<EmpleadoQR />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
        <Route path="/scanner" element={<AdminScanner />} />
      </Routes>
    </div>
  </div>
);

export default AdminLayout;