import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import AdminUsuarios from '../admin/AdminUsuarios';
import AdminPuestos from '../admin/AdminPuestos';
import AdminDepartamentos from '../admin/AdminDepartamentos';
import AdminHistorial from '../admin/AdminHistorial';
import EmpleadoQR from '../empleado/EmpleadoQR';
import AdministrativoDashboard from './AdministrativoDashboard';

const links = [
  { to: '/dashboard', icono: '🏠', label: 'Inicio' },
  { to: '/usuarios', icono: '👥', label: 'Empleados' },
  { to: '/puestos', icono: '🗂', label: 'Áreas' },
  { to: '/departamentos', icono: '🏢', label: 'Deptos' },
  { to: '/historial', icono: '📋', label: 'Historial' },
  { to: '/mi-qr', icono: '📱', label: 'Mi QR' },
];

const AdministrativoLayout = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <Navbar links={links} />
    <div className="flex-1 p-4 max-w-4xl mx-auto w-full">
      <Routes>
        <Route path="/dashboard" element={<AdministrativoDashboard />} />
        <Route path="/usuarios" element={<AdminUsuarios />} />
        <Route path="/puestos" element={<AdminPuestos />} />
        <Route path="/departamentos" element={<AdminDepartamentos />} />
        <Route path="/historial" element={<AdminHistorial />} />
        <Route path="/mi-qr" element={<EmpleadoQR />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  </div>
);

export default AdministrativoLayout;