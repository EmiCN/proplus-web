import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import PoliciaScanner from './PoliciaScanner';
import EmpleadoQR from '../empleado/EmpleadoQR';

const links = [
  { to: '/scanner', icono: '📷', label: 'Lector QR' },
  { to: '/mi-qr', icono: '📱', label: 'Mi QR' },
];

const PoliciaLayout = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <Navbar links={links} />
    <div className="flex-1 p-4 max-w-4xl mx-auto w-full">
      <Routes>
        <Route path="/scanner" element={<PoliciaScanner />} />
        <Route path="/mi-qr" element={<EmpleadoQR />} />
        <Route path="*" element={<Navigate to="/scanner" />} />
      </Routes>
    </div>
  </div>
);

export default PoliciaLayout;