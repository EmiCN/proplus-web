import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // No cargar sesión guardada — siempre pedir login al abrir
    setCargando(false);
  }, []);

  const login = async (numero_nomina, contrasena) => {
    try {
      const respuesta = await api.post('/auth/login', { numero_nomina, contrasena });
      const { token, usuario } = respuesta.data;
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));
      setUsuario(usuario);
      return { exito: true };
    } catch (error) {
      const mensaje = error.response?.data?.mensaje || 'Error al iniciar sesión';
      return { exito: false, mensaje };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);