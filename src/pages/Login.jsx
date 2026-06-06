import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import logoPng from '../assets/logo_proplus.png';

const Login = () => {
  const [numero_nomina, setNumeroNomina] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [verContrasena, setVerContrasena] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!numero_nomina || !contrasena) {
      setError('Por favor ingresa tu número de nómina y contraseña');
      return;
    }
    setCargando(true);
    setError('');
    const resultado = await login(numero_nomina.trim(), contrasena);
    setCargando(false);
    if (!resultado.exito) {
      setError(resultado.mensaje);
    }
  };

  return (
    <div className="min-h-screen bg-principal flex flex-col items-center justify-center p-5">
      <div className="mb-8 flex flex-col items-center">
        <div className="bg-black rounded-2xl p-4 mb-3 border-b-4 border-acento">
          <img src={logoPng} alt="ProPlus" className="h-12 w-auto" />
        </div>
        <p className="text-white/70 text-sm">Control de Acceso</p>
      </div>

      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl border-t-4 border-acento">
        <h1 className="text-2xl font-bold text-principal text-center mb-1">Iniciar sesión</h1>
        <p className="text-gray-400 text-sm text-center mb-6">Ingresa tu número de nómina y contraseña</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <label className="block text-sm font-semibold text-principal mb-1">Número de nómina</label>
          <input
            type="number"
            className="w-full border border-gray-200 rounded-xl p-3 mb-4 bg-gray-50 text-principal focus:outline-none focus:border-principal"
            placeholder="Ej. 12345"
            value={numero_nomina}
            onChange={e => setNumeroNomina(e.target.value.replace(/[^0-9]/g, ''))}
            maxLength={10}
          />

          <label className="block text-sm font-semibold text-principal mb-1">Contraseña</label>
          <div className="flex border border-gray-200 rounded-xl bg-gray-50 mb-6">
            <input
              type={verContrasena ? 'text' : 'password'}
              className="flex-1 p-3 bg-transparent text-principal focus:outline-none"
              placeholder="Contraseña"
              value={contrasena}
              onChange={e => setContrasena(e.target.value)}
            />
            <button type="button" className="px-3 text-xl" onClick={() => setVerContrasena(!verContrasena)}>
              {verContrasena ? '🙈' : '👁'}
            </button>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-principal text-white font-bold py-3 rounded-xl border-b-4 border-acento hover:opacity-90 transition disabled:opacity-50"
          >
            {cargando ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;