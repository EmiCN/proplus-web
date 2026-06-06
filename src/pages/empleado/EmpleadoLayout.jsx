import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import EmpleadoQR from './EmpleadoQR';

const links = [
  { to: '/mi-qr', icono: '📱', label: 'Mi QR' },
];

const EmpleadoLayout = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <Navbar links={links} />
    <div className="flex-1 p-4 max-w-4xl mx-auto w-full">
      <Routes>
        <Route path="/mi-qr" element={<EmpleadoQR />} />
        <Route path="*" element={<Navigate to="/mi-qr" />} />
      </Routes>
    </div>
  </div>
);

export default EmpleadoLayout;